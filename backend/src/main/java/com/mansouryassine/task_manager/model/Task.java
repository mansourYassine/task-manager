package com.mansouryassine.task_manager.model;

import com.mansouryassine.task_manager.enums.Priority;
import com.mansouryassine.task_manager.enums.Status;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Nullable
    private Date dueDate;
    private String createdBy;
    private String assignedTo;

    public Task(
            String title,
            String description,
            Priority priority,
            Status status,
            @org.jspecify.annotations.Nullable Date dueDate,
            String createdBy,
            String assignedTo) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
    }

}
