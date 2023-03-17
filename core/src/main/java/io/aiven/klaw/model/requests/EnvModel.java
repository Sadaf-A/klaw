package io.aiven.klaw.model.requests;

import io.aiven.klaw.dao.EnvTag;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class EnvModel implements Serializable {

  @NotNull
  @Size(min = 2, max = 10, message = "Please fill in a valid name")
  @Pattern(message = "Invalid environment name !!", regexp = "^[a-zA-Z0-9_.-]{3,}$")
  private String name;

  @NotNull private String type;

  @NotNull private Integer clusterId;

  @Pattern(message = "Invalid prefix", regexp = "^$|^[a-zA-Z0-9_.-]{3,}$")
  private String topicprefix;

  @Pattern(message = "Invalid suffix", regexp = "^$|^[a-zA-Z0-9_.-]{3,}$")
  private String topicsuffix;

  private String otherParams;

  private String id;

  private String defaultPartitions;

  private String maxPartitions;

  private String defaultReplicationFactor;

  private String maxReplicationFactor;

  private EnvTag associatedEnv;

  private Integer tenantId;
}