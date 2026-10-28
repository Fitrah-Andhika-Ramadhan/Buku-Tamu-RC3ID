<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class ZoomSchedule extends Model
{
    use HasFactory;

    protected $table = 'zoom_schedules';

    protected $fillable = [
        'title',
        'division',
        'pic_name',
        'pic_contact',
        'is_recurring',
        'meeting_date',
        'day_of_week',
        'start_time',
        'end_time',
        'zoom_link',
        'zoom_id',
        'zoom_passcode',
        'status',
        'notes',
    ];

    protected $casts = [
        'is_recurring' => 'boolean',
        'meeting_date' => 'date:Y-m-d',
    ];

    public static $dayMap = [
        0 => 'Minggu',
        1 => 'Senin',
        2 => 'Selasa',
        3 => 'Rabu',
        4 => 'Kamis',
        5 => 'Jumat',
        6 => 'Sabtu',
    ];

    public static function getDayName($dateString)
    {
        $dt = Carbon::parse($dateString);
        return self::$dayMap[$dt->dayOfWeek];
    }

    /**
     * Check if a given date & time interval conflicts with existing schedules.
     */
    public static function findConflicts($date, $startTime, $endTime, $excludeId = null)
    {
        $dayName = self::getDayName($date);

        // 1. Check non-recurring on specific date
        $singleQuery = self::where('is_recurring', false)
            ->whereDate('meeting_date', $date)
            ->where('status', '!=', 'cancelled')
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);

        if ($excludeId) {
            $singleQuery->where('id', '!=', $excludeId);
        }

        $singleConflicts = $singleQuery->get();

        // 2. Check recurring meetings on that day of week
        $recurringQuery = self::where('is_recurring', true)
            ->where(function ($q) use ($dayName) {
                $q->where('day_of_week', $dayName)
                  ->orWhere('day_of_week', strtolower($dayName));
            })
            ->where('status', '!=', 'cancelled')
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);

        if ($excludeId) {
            $recurringQuery->where('id', '!=', $excludeId);
        }

        $recurringConflicts = $recurringQuery->get();

        $allConflicts = $singleConflicts->concat($recurringConflicts);

        return [
            'has_conflict' => $allConflicts->isNotEmpty(),
            'conflicts'    => $allConflicts->unique('id')->values(),
            'day_name'     => $dayName,
        ];
    }

    /**
     * Return active schedules that apply to a specific calendar date.
     *
     * @return Collection<int, self>
     */
    public static function forDate($date): Collection
    {
        $dayName = self::getDayName($date);

        return self::query()
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($date, $dayName) {
                $query->where(function ($single) use ($date) {
                    $single->where('is_recurring', false)
                        ->whereDate('meeting_date', $date);
                })->orWhere(function ($recurring) use ($dayName) {
                    $recurring->where('is_recurring', true)
                        ->where('day_of_week', $dayName);
                });
            })
            ->orderBy('start_time')
            ->get();
    }

    /**
     * Find conflicts for a weekly series, including dated meetings that fall
     * on the same weekday in the future.
     */
    public static function findRecurringConflicts($dayName, $startTime, $endTime, $excludeId = null): array
    {
        $recurring = self::query()
            ->where('is_recurring', true)
            ->where('day_of_week', $dayName)
            ->where('status', '!=', 'cancelled')
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);

        if ($excludeId) {
            $recurring->where('id', '!=', $excludeId);
        }

        $dated = self::query()
            ->where('is_recurring', false)
            ->whereDate('meeting_date', '>=', Carbon::today()->toDateString())
            ->where('status', '!=', 'cancelled')
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);

        if ($excludeId) {
            $dated->where('id', '!=', $excludeId);
        }

        $datedConflicts = $dated->get()->filter(function (self $schedule) use ($dayName) {
            return $schedule->meeting_date && self::getDayName($schedule->meeting_date) === $dayName;
        });

        $conflicts = $recurring->get()->concat($datedConflicts)->unique('id')->values();

        return [
            'has_conflict' => $conflicts->isNotEmpty(),
            'conflicts' => $conflicts,
            'day_name' => $dayName,
        ];
    }
}
