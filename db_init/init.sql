CREATE SCHEMA IF NOT EXISTS cryptown;

CREATE TABLE IF NOT EXISTS cryptown.users (
    userId varchar(255),
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    attempts integer NOT NULL, 
    banDateTime timestamp,
    PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS cryptown.favourite (
    favId varchar(255),
    userId varchar(255) NOT NULL,
    coinName varchar(255) NOT NULL,
    PRIMARY KEY (favId)
);

CREATE TABLE IF NOT EXISTS cryptown.posts (
    postId varchar(255),
    userId varchar(255) NOT NULL,
    post text NOT NULL,
    postDateTime timestamp NOT NULL,
    serverDateTime timestamp NOT NULL,
    PRIMARY KEY (postId)
);


CREATE TABLE IF NOT EXISTS cryptown.subposts (
    subpostId varchar(255),
    postId varchar(255),
    userId varchar(255) NOT NULL,
    subpost text NOT NULL,
    subpostDateTime timestamp NOT NULL,
    serverDateTime timestamp NOT NULL,
    PRIMARY KEY (subpostId)
);