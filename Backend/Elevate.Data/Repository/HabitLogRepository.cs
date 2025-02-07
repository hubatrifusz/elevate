using Elevate.Extensions;
using Elevate.Models.HabitLog;

namespace Elevate.Data.Repository
{
    public class HabitLogRepository(ElevateDbContext context)
    {
        readonly ElevateDbContext _context = context;

        public List<HabitLogModel> GetHabitLogsByHabitId(Guid habitId, int pageNumber, int pageSize)
        {
            return _context.Set<HabitLogModel>()
                .Where(hl => hl.HabitId == habitId)
                .OrderBy(hl => hl.DueDate)
                .ApplyPagination(pageNumber, pageSize)
                .ToList();
        }

        public HabitLogModel? GetHabitLogById(Guid habitLogId)
        {
            return _context.Set<HabitLogModel>().SingleOrDefault(hl => hl.Id == habitLogId);
        }

        public HabitLogModel? AddHabitLog(HabitLogModel habitLog)
        {
            HabitLogModel savedHabitLog = _context.Set<HabitLogModel>().Add(habitLog).Entity;
            _context.SaveChanges();
            return savedHabitLog;
        }

        public HabitLogModel? UpdateHabitLog(Guid id, HabitLogModel habitLog)
        {
            if (id != habitLog.Id)
            {
                throw new Exception("Habit Log ID does not match");
            }
            if (!_context.Set<HabitLogModel>().Any(hl => hl.Id == id))
            {
                throw new Exception("No such habit log");
            }

            HabitLogModel updatedHabitLog = _context.Set<HabitLogModel>().Update(habitLog).Entity;
            _context.SaveChanges();
            return updatedHabitLog;
        }

        public HabitLogModel? DeleteHabitLog(Guid habitLogId)
        {
            HabitLogModel? habitLog = _context.Set<HabitLogModel>().SingleOrDefault(hl => hl.Id == habitLogId);

            if (habitLog == null)
            {
                throw new Exception("No such habit log");
            }

            _context.Set<HabitLogModel>().Remove(habitLog);
            _context.SaveChanges();
            return habitLog;
        }
    }
}
