package com.mansouryassine.task_manager.service;

import com.mansouryassine.task_manager.dto.TaskDto;
import com.mansouryassine.task_manager.mapper.TaskDtoMapper;
import com.mansouryassine.task_manager.model.Task;
import com.mansouryassine.task_manager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    public final TaskRepository taskRepository;
    public final TaskDtoMapper taskDtoMapper;

    public TaskService(TaskRepository taskRepository, TaskDtoMapper taskDtoMapper) {
        this.taskRepository = taskRepository;
        this.taskDtoMapper = taskDtoMapper;
    }

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(taskDtoMapper)
                .toList();
    }
}
