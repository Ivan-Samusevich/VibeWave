package com.example.VibeWave.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_profile")
public class UserProfile {
    //todo Узнать, как правильно записать id, если он должен создаватьс тогда же, когда и сам пользователь
    @Id
    private int userProfileId;
    private String description;
    private String avatar_url;
    private boolean is_active;

}
