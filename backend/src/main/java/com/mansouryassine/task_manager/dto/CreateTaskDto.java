package com.mansouryassine.task_manager.dto;

import com.mansouryassine.task_manager.enums.Priority;
import com.mansouryassine.task_manager.enums.Status;

import java.time.LocalDate;
import java.util.Date;

public record CreateTaskDto(
        String title,
        String description,
        Priority priority,
        LocalDate dueDate,
        String assignedTo
) {
}
