package com.mansouryassine.task_manager.service;

import com.mansouryassine.task_manager.Exception.TaskNotFoundException;
import com.mansouryassine.task_manager.dto.CreateTaskDto;
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
        return new TaskDto(
              createdTask.getId(),
              createdTask.getTitle(),
              createdTask.getDescription(),
              createdTask.getPriority(),
              createdTask.getStatus(),
              createdTask.getDueDate(),
              createdTask.getCreatedBy(),
              createdTask.getAssignedTo()
        );
    }

    @Transactional
    public TaskDto updateTask(Long id, UpdateTaskDto updateTaskDto) {
        if (taskRepository.existsById(id)) {
            Task task = new Task(
                    id,
                    updateTaskDto.title(),
                    updateTaskDto.description(),
                    updateTaskDto.priority(),
                    updateTaskDto.status(),
                    updateTaskDto.dueDate(),
                    "Yassine Admin",
                    updateTaskDto.assignedTo()
            );

            Task updatedTask = taskRepository.save(task);

            return new TaskDto(
                    updatedTask.getId(),
                    updatedTask.getTitle(),
                    updatedTask.getDescription(),
                    updatedTask.getPriority(),
                    updatedTask.getStatus(),
                    updatedTask.getDueDate(),
                    updatedTask.getCreatedBy(),
                    updatedTask.getAssignedTo()
            );
        } else {
            throw new TaskNotFoundException("Task with id " + id + " doesn't exists");
        }
    }
}
