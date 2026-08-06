package com.mansouryassine.task_manager.mapper;

import com.mansouryassine.task_manager.dto.TaskDto;
import com.mansouryassine.task_manager.model.Task;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class TaskDtoMapper implements Function<Task, TaskDto> {
    @Override
    public TaskDto apply(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getDueDate(),
                task.getCreatedBy(),
                task.getAssignedTo()
        );
    }
}
