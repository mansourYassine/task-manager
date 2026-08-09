package com.mansouryassine.task_manager.service;

import com.mansouryassine.task_manager.Exception.TaskNotFoundException;
import com.mansouryassine.task_manager.dto.CreateTaskDto;
import com.mansouryassine.task_manager.dto.StatusDto;
import com.mansouryassine.task_manager.dto.TaskDto;
import com.mansouryassine.task_manager.dto.UpdateTaskDto;
import com.mansouryassine.task_manager.enums.Status;
import com.mansouryassine.task_manager.mapper.TaskDtoMapper;
import com.mansouryassine.task_manager.model.Task;
import com.mansouryassine.task_manager.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.lang.reflect.RecordComponent;
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

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(taskDtoMapper)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(taskDtoMapper)
                .orElseThrow(() -> new TaskNotFoundException("Task with id "+ id +" Not Found!"));
    }

    public TaskDto createTask(CreateTaskDto createTaskDto) {
        Task task = new Task(
                createTaskDto.title(),
                createTaskDto.description(),
                createTaskDto.priority(),
                Status.TODO,
                createTaskDto.dueDate(),
                "Yassine Admin",
                createTaskDto.assignedTo()
        );

        Task createdTask = taskRepository.save(task);
        return mapToDto(createdTask);
    }

    @Transactional
    public TaskDto updateTask(Long id, UpdateTaskDto updateTaskDto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task with id "+ id +" Not Found!"));

        task.setTitle(updateTaskDto.title());
        task.setDescription(updateTaskDto.description());
        task.setPriority(updateTaskDto.priority());
        task.setStatus(updateTaskDto.status());
        task.setDueDate(updateTaskDto.dueDate());
        task.setAssignedTo(updateTaskDto.assignedTo());

        return mapToDto(task);
    }

    @Transactional
    public TaskDto updateTaskStatus(Long id, StatusDto taskStatus) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task with id "+ id +" Not Found!"));

        task.setStatus(taskStatus.status());

        return mapToDto(task);
    }

    private TaskDto mapToDto(Task task) {
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
