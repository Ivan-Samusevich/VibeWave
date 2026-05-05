package VibeWave.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    private Long postCount;
    private Long followerCount;
    private Long followingCount;
    //private boolean isActive;

}
