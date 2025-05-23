@ECHO OFF
SETLOCAL

SET COMPOSE_FILE=compose-backend.yaml
SET SQL_SCRIPT_FILE=seed-data.sql
SET MYSQL_DATABASE_NAME=elevate
SET ENV_FILE=.env

REM Attempt to read MYSQL_ROOT_PASSWORD from .env file
SET "EFFECTIVE_MYSQL_ROOT_PASSWORD="
IF NOT EXIST "%ENV_FILE%" (
    ECHO Warning: %ENV_FILE% not found. Will rely on MYSQL_ROOT_PASSWORD being set in the environment.
) ELSE (
    FOR /F "usebackq tokens=1,* delims==" %%A IN ("%ENV_FILE%") DO (
        IF "%%A"=="MYSQL_ROOT_PASSWORD" SET "EFFECTIVE_MYSQL_ROOT_PASSWORD=%%B"
    )
)

REM If not found in .env, check if it's already in the host environment
IF "%EFFECTIVE_MYSQL_ROOT_PASSWORD%"=="" (
    IF DEFINED MYSQL_ROOT_PASSWORD (
        SET "EFFECTIVE_MYSQL_ROOT_PASSWORD=%MYSQL_ROOT_PASSWORD%"
        ECHO Using MYSQL_ROOT_PASSWORD from existing host environment variable.
    ) ELSE (
        ECHO ERROR: MYSQL_ROOT_PASSWORD is not set.
        ECHO Please define it in your %ENV_FILE% file (e.g., MYSQL_ROOT_PASSWORD=yourpassword)
        ECHO or as a host environment variable.
        GOTO :cleanup_and_exit_early
    )
) ELSE (
    ECHO MYSQL_ROOT_PASSWORD loaded from %ENV_FILE% file.
)

ECHO Starting services and applying migrations...
docker compose -f %COMPOSE_FILE% up --build -d --wait
IF ERRORLEVEL 1 (
    ECHO Failed to start Docker services. Check Docker daemon and %COMPOSE_FILE%.
    GOTO :cleanup_and_exit
)

TIMEOUT /T 15 /NOBREAK > nul

FOR /F "tokens=*" %%i IN ('docker compose -f %COMPOSE_FILE% ps -q db') DO SET DB_CONTAINER_ID=%%i

IF NOT DEFINED DB_CONTAINER_ID (
    ECHO Failed to get DB_CONTAINER_ID. Is the 'db' service running and named 'db' in %COMPOSE_FILE%?
    ECHO Output of 'docker compose -f %COMPOSE_FILE% ps':
    docker compose -f %COMPOSE_FILE% ps
    GOTO :cleanup_and_exit
)
ECHO DB_CONTAINER_ID: %DB_CONTAINER_ID%

ECHO Copying %SQL_SCRIPT_FILE% to DB container...
docker cp "%SQL_SCRIPT_FILE%" "%DB_CONTAINER_ID%:/tmp/seed-data.sql"
IF ERRORLEVEL 1 (
    ECHO Failed to copy %SQL_SCRIPT_FILE% to container %DB_CONTAINER_ID%. Seeding aborted.
    GOTO :cleanup_and_exit
)

ECHO Executing seed script in DB container...
ECHO DEBUG: Attempting to use EFFECTIVE_MYSQL_ROOT_PASSWORD: [%EFFECTIVE_MYSQL_ROOT_PASSWORD%]
docker exec "%DB_CONTAINER_ID%" mysql -uroot -p"%EFFECTIVE_MYSQL_ROOT_PASSWORD%" "%MYSQL_DATABASE_NAME%" -e "SOURCE /tmp/seed-data.sql"

IF ERRORLEVEL 1 (
    ECHO Failed to execute seed script.
    ECHO Possible reasons:
    ECHO 1. Incorrect MYSQL_ROOT_PASSWORD (ensure value in %ENV_FILE% or host env matches DB config).
    ECHO 2. Database container '%DB_CONTAINER_ID%' not fully ready or has issues.
    ECHO 3. SQL script '%SQL_SCRIPT_FILE%' contains errors.
    ECHO 4. Database '%MYSQL_DATABASE_NAME%' does not exist or user 'root' lacks permissions.
    ECHO Last errorlevel from mysql exec: %ERRORLEVEL%
    ECHO Consider checking 'docker logs %DB_CONTAINER_ID%' for database errors.
) ELSE (
    ECHO Seeding script executed successfully.
)

PAUSE

:cleanup_and_exit
ENDLOCAL
:eof

:cleanup_and_exit_early
PAUSE
ENDLOCAL
:eof