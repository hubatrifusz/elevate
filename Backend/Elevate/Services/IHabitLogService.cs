using Elevate.Models.HabitLog;

namespace Elevate.Services
{
    public interface IHabitLogService
    {
        List<HabitLogModel>? GetHabitLogsByHabitId(Guid habitId, int pageNumber, int pageSize);
        HabitLogModel? GetHabitLogById(Guid habitLogId);
        HabitLogModel? AddHabitLog(HabitLogCreateDto habitLog);
        HabitLogModel? UpdateHabitLog(Guid id, HabitLogUpdateDto habitLog);
        HabitLogModel? DeleteHabitLog(Guid habitLogId);
    }
}
