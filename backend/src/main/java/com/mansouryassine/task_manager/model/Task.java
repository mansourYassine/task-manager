package com.mansouryassine.task_manager.model;

import com.mansouryassine.task_manager.enums.Priority;
import com.mansouryassine.task_manager.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Priority priority;
    private Status status;
    private Date dueDate;
    private String createdBy;
    private String assignedTo;

}
