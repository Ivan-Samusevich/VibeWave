package VibeWave.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "saved_posts")
public class SavedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long savePostId;

    private Long userId;
    private Long postId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
