package com.viseo.c360.formation.domain.training;

import com.viseo.c360.formation.domain.BaseEntity;
import com.viseo.c360.formation.dto.training.TopicDescription;
import com.viseo.c360.formation.dto.training.TrainingDescription;
import org.hibernate.annotations.*;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Entity
public class Training extends BaseEntity {

	@NotNull
	@Pattern(regexp= TrainingDescription.Regex.TRAINING_TITLE+"*")
	@Column(unique=true, nullable=false)
	String trainingTitle;

	@NotNull
	@Min(value = 1)
	@Max(value = 200)
	int numberHalfDays;

	@NotNull
	@ManyToOne()
	Topic topic;

	public Training() {
	}

	public String getTrainingTitle() {

		return trainingTitle;
	}

	public void setTrainingTitle(String trainingTitle) {

		this.trainingTitle = trainingTitle;
	}

	public int getNumberHalfDays() {

		return numberHalfDays;
	}

	public void setNumberHalfDays(int numberHalfDays) {

		this.numberHalfDays = numberHalfDays;
	}

	public Topic getTopic() {
		return topic;
	}

	public void setTopic(Topic topic) {
		this.topic = topic;
	}
}

