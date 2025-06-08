import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && (defined(slug.current) && (!defined($search) || title match $search || category match $search || author->name match $search))] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    description,
    category,
    image,
    helpNeeded,
    projectLink,
    likes,
    comments,
    pitch
  }`);


export const STARTUP_BY_ID_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  pitch,
  helpNeeded,
  projectLink,
  likes,
    comments,
     joinRequests,
  teamMembers,
  
}`);

export const STARTUP_VIEWS_QUERY = defineQuery(`
    *[_type == "startup" && _id == $id][0]{
        _id, views
    }
`);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && username == $username][0]{
    _id,
    name,
    username,
    email,
    image,
    bio
  }
`);



export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio,
    likes,
    comments,
}
`);

export const STARTUPS_BY_AUTHOR_QUERY = `
  *[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    description,
    category,
    helpNeeded,
    image,
    pitch,
    projectLink,
    views,
    likes,
    comments,
    author->{
      _id,
      name,
      image
    }
  }
`;


export const PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    pitch,
    likes,
    comments,
  }
}`);
export const ALL_STARTUPS_QUERY = defineQuery(`
  *[_type == "startup" && defined(slug.current)] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    description,
    category,
    image,
    likes,
    comments,
  }
`);
