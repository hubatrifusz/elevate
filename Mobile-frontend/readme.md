# Elevate workplan

## Feed
- fab buttom hozzáadás szokás létrehozáshoz

## Habitdetails oldal

- habit név
- habit description
- gyakoriság és annak editálása

## Calendar

Calendar oldal:
- ionic calendar
- adatok betöltése backend
- kattintásra megjelenik a napi cél és ott is kipipalhatod, csinálhatsz újat, csak mai/tegnap/tegnap előttit pipálhatod
- meg kell jeleníteni valami színnel a dátum körül valamit ????

## Friend

- baráti kérelem küldés, fogadás
- barátok megtekintése, törlése

## Settings

- dark/white téma választás
- notification kikapcsolás

## Push notifications

- Küldeni, hogy ma ezt csináld
- Ügyes vagy, veress tovább
- 3 napja nem cigiztél, menő

Ilyen típusú dolgokat kell küldeni

## Tesztek :/



### habit details
created_at datetime [not null, default: `now()`]
  title varchar(20) [not null]
  description varchar(100)
  frequency Frequency [not null]
  custom_frequency smallint	=> pl.: 65 = 01000001 = Monday, Sunday
  color varchar(6) [not null]
  is_positive boolean [not null]
  streak integer [not null, default: 0]
  streak_start datetime
