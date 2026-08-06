package com.mansouryassine.task_manager.model;

import com.mansouryassine.task_manager.enums.Priority;
import com.mansouryassine.task_manager.enums.Status;
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
    private Priority priority; // LOW, MEDIUM, HIGH
    @Enumerated(EnumType.STRING)
    private Status status; // TODO, IN_PROGRESS, DONE
    private Date dueDate;
    private String createdBy;
    private String assignedTo;

}
