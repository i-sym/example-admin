# Schemas

```
// title
title Drone Data Collection and Visualization Data Model

// define tables
users [icon: user, color: yellow]{
  id uuid pk
  kindeId string
  name string
  email string
  createdAt timestamp
  updatedAt timestamp
}

user_area_permissions {
  userId uuid
  areaId uuid
}

areas [icon: map, color: green]{
  id uuid pk
  name string
  description string
  size GeographicalSize
  location GeographicalLocation
  createdAt timestamp
  updatedAt timestamp
}


flights [icon: send, color: blue]{
  id uuid pk
  areaId uuid
  startTime timestamp
  createdAt timestamp
  updatedAt timestamp
}

recordings [icon: video, color: red]{
  id uuid pk
  flightId uuid
  channel string
  fileName string
  fileSize int?
  duration int?
  capturedAt timestamp?
  createdAt timestamp
  updatedAt timestamp
}

scenes [icon: image, color: purple]{
  id uuid pk
  areaId uuid
  flightId uuid
  name string?
  description string?
  createdBy uuid
  multisplatId uuid
  offset GeographicalOffset
  time timestamp
  createdAt timestamp
  updatedAt timestamp
}

scene_events [icon: image, color: purple]{
  id uuid pk
  sceneId uuid pk
  event SceneEvent
  createdAt timestamp
}

multisplats [icon: layers, color: teal]{
  id uuid pk
  sceneId uuid
  fileName string
  fileSize int
  numberOfSplats int
  createdAt timestamp
  updatedAt timestamp
}

multisplatChunks [icon: grid, color: pink]{
  id uuid pk
  multisplatId uuid
  chunkIndexX int
  chunkIndexY int
  fileName string
}

// define relationships
areas.id < scenes.areaId
areas.id < flights.areaId
flights.areaId > areas.id
multisplats.sceneId > scenes.id
scenes.areaId > areas.id
scenes.flightId > flights.id
scenes.multisplatId > multisplats.id
recordings.flightId > flights.id
multisplatChunks.multisplatId > multisplats.id
user_area_permissions.userId < users.id
user_area_permissions.areaId  < areas.id
scenes.createdBy < users.id
scene_events.sceneId < scenes.id


```