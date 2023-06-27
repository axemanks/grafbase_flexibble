import { GraphQLClient } from "graphql-request";

import { createProjectMutation, createUserMutation, deleteProjectMutation, updateProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery } from "@/graphql";
import { ProjectForm } from "@/common.types";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl);

// get the session token from next auth
export const fetchToken = async () => {
  try {
    // hit the next auth endpoint to the session token
    const response = await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
  } catch (err) {
    throw err;
  }
};

// upload the image to cloudinary
export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        path: imagePath,
      }),
    });
    return response.json();
  } catch (err) {
    throw err;
  }
};

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return await client.request(query, variables);
  } catch (err) {
    throw err;
  }
};

// fetchAllProjects
export const fetchAllProjects = (category?: string | null, endcursor?: string | null) => {
  client.setHeader("x-api-key", apiKey);

  return makeGraphQLRequest(projectsQuery, { category, endcursor });
};

// createNewProject
// type = ProjectForm
export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
  // get the url
  const imageUrl = await uploadImage(form.image);
  
  if (imageUrl.url) {
    // ADD THE AUTH HEADER
    client.setHeader("Authorization", `Bearer ${token}`);
    // variables
    const variables = {
      input: { 
        ...form, 
        image: imageUrl.url, 
        createdBy: { 
          link: creatorId
        }
      }
    };

    return makeGraphQLRequest(createProjectMutation, variables);
  }
};
// updateProject - checks if image has been changed
export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  // if base64 = new uload if not = old file
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }
  // create updated form
  let updatedForm = { ...form };
  // set isUploadingNewImage
  const isUploadingNewImage = isBase64DataURL(form.image);
  // check
  if (isUploadingNewImage) {
    // get imageUrl
    const imageUrl = await uploadImage(form.image);
    // add it to the form
    if (imageUrl.url) {
      // spread old form, add image, save to updatedForm
      updatedForm = { ...updatedForm, image: imageUrl.url };
    }
  }
  // add header
  client.setHeader("Authorization", `Bearer ${token}`);
  // set variables
  const variables = {
    id: projectId,
    input: updatedForm,
  };
  // upload to GraphQL
  return makeGraphQLRequest(updateProjectMutation, variables);
};
// Delete - secure Action needs header - "Authorization", `Bearer ${token}`
export const deleteProject = (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};
// getProjectDetails - client.setHeader("x-api-key", apiKey);
export const getProjectDetails = (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);

  const variables = {
    input: {
      name: name,
      email: email,
      avatarUrl: avatarUrl
    },
  };
  
  return makeGraphQLRequest(createUserMutation, variables);
};

export const getUserProjects = (id: string, last?: number) => {
  // add key to header
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const getUser = (email: string) => {
  // add key to header
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};