package VibeWave.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users_profile")
public class UserProfile {

    @Id
    private Long userProfileId;

    private String description;
    private String avatarFileName;

    private Long postCount = 0L;
    private Long followerCount = 0L;
    private Long followingCount = 0L;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id")
    private User user;

    //private boolean isActive;

}
