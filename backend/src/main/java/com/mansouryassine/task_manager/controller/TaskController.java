package com.mansouryassine.task_manager.controller;

import com.mansouryassine.task_manager.dto.CreateTaskDto;
import com.mansouryassine.task_manager.dto.StatusDto;
import com.mansouryassine.task_manager.dto.TaskDto;
import com.mansouryassine.task_manager.dto.UpdateTaskDto;
import com.mansouryassine.task_manager.enums.Status;
import com.mansouryassine.task_manager.model.Task;
import com.mansouryassine.task_manager.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    public final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody CreateTaskDto createTaskDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(createTaskDto));
    }

    @PutMapping("/{id}")
    public  ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody UpdateTaskDto taskDto) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDto));
    }

    @PatchMapping("/{id}/status")
    public  ResponseEntity<TaskDto> updateTaskStatus(@PathVariable Long id, @RequestBody StatusDto status) {
        return  ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
