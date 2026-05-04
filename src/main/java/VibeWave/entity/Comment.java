package VibeWave.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    private Long userId;
    private Long postId;
    //private Long parentId; //todo в перспективе это надо для написания комментария под комментарием
    private String text;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // todo Сделать dto для отправки комментов. В дто будет ник, в комменте id. Приполучении списка будем переделывать каждый коммент в dto.
    //todo Сделать request и responce для комментов
}
