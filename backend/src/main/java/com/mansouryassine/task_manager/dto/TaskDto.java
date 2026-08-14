package com.mansouryassine.task_manager.dto;

import com.mansouryassine.task_manager.enums.Priority;
import com.mansouryassine.task_manager.enums.Status;

import java.time.LocalDate;
import java.util.Date;

public record TaskDto(
        Long id,
        String title,
        String description,
        Priority priority,
        Status status,
        LocalDate dueDate,
        String createdBy,
        String assignedTo
) {
}
