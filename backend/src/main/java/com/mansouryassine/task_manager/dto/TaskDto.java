package com.mansouryassine.task_manager.dto;

import com.mansouryassine.task_manager.enums.Priority;
import com.mansouryassine.task_manager.enums.Status;

import java.util.Date;

public record TaskDto(
        Long id,
        String title,
        String description,
        Priority priority,
        Status status,
        Date dueDate,
        String createdBy,
        String assignedTo
) {
}
