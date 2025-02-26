# Streamify

> ⚠️ WIP: Not ready for production use yet, just started development on this project.

Streamify is a self-hosted video streaming platform built using Java Spring Boot, 
React TypeScript, MongoDB, and Nginx as a reverse proxy. It allows users to 
easily deploy their own streaming service without the need to hire developers. 
Just install Docker (or later, a standalone `.exe` or `.deb` package) and you're ready 
to go!

## Contact
If you need help, have issues, questions, or feature requests:

- Email: <a href="mailto:nullpointerexcy@gmail.com"><img src="https://img.shields.io/badge/-Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
- GitHub Issues: https://github.com/NullPointerExcy/streamify/issues

## Feature Checklist

### User UI
<details>
  <summary> Click here to expand </summary>

| Feature | 	Status                                                                                     | 	Notes |
|---------|---------------------------------------------------------------------------------------------|--------|
|Community Module	| 🚧 Implemented, need to add image support and link support                                  |Users can create and participate in discussions, comment on topics, and filter by title, games, and videos.|
|Video Streaming	| ⚠️ Bugged	                                                                                  |HLS playback is currently bugged.|
|Playlists	| ✅ Completed	                                                                                |Create, sort, and search playlists by name or genre.|
|Watch History	| ✅ Completed	                                                                                |Track watched videos with details like view count, duration, and upload date.|
|Watch List	| ✅ Completed	                                                                                |Save videos to a watch list for later viewing.|
|User Settings	| 🚧 Implemented, but needs work	                                                             |Update username, email, password, and profile picture.|
|Login (OAuth Integration)	| 🔜 Planned	Support for Google and Twitch OAuth login. Currently only supports custom login. |
</details>


### Admin Tools
<details>
  <summary> Click here to expand </summary>

| Feature	| Status	                                                | Notes | 
|---------|--------------------------------------------------------|--------|
| Admin Panel	| ✅ Completed	                                           | Centralized management of the platform.| 
| Game Management	| ✅ Completed	                                           | Manage game-related metadata.| 
| Video Management	| ✅ Completed	                                           | Manage video uploads and metadata.| 
| Playlist Management	| ✅ Completed	                                           | Create and manage playlists.| 
| User Management	| ✅ Completed	                                           | Manage user accounts and roles.| 
| Design Settings	| 🚧 Implemented, but still adding more design options.	 | Change color scheme, title, and other design elements.| 
| Feature Management	| 🚧 Implemented, but also adding more features.	        | Enable or disable features like community or limit it for specific users.| 
| Application Properties Management	| 🚧 Implemented, more are going to be added	            | Set streaming resource folder, video storage path, and other application properties.| 

</details>


### UI
<details>
  <summary> Click here to expand </summary>

| Feature	| Status	| Notes| 
|---------|---------|--------|
| Community Module	| ✅ Completed	|Create topics, comment on them, filter by title, creator, or related games/videos.|
| OAuth Integration	| 🔜 Planned	|Support for Google and Twitch OAuth login.|
| Playlist Management	| ✅ Completed	|Create, sort, and search playlists.|
| Video Playback	| ⚠️ Bugged	|HLS video streaming has issues.|
| Watch List Integration| 	✅ Completed	|Add or remove videos from the watch list.|
| Video Thumbnails	| ✅ Completed	|Display thumbnails for each video in a playlist.|
| Responsive Design| 	✅ Completed	|Adaptive grid layout for various screen sizes.|
| Hover Effects	| ✅ Completed	|Interactive hover effects for modern UI.|
| Profile Management	| ✅ Completed	|Change username, email, and password.|
| Profile Picture Upload	| ✅ Completed	|Upload and preview profile pictures.|
| Dynamic Update| 	✅ Completed	|Real-time updates without page refreshes.|
| Video Library	| ✅ Completed	|Browse and filter videos by name, game, or playlist.|
| Dynamic Filtering and Sorting	| ✅ Completed	|Real-time search and sorting options.|
| Watch Time Tracking	| ✅ Completed	|Track watch time for personalized analytics.|
| View History	| ✅ Completed	|List of previously watched videos.|
| Interactive Navigation	| ✅ Completed	|Navigate directly to the watched video from history.|
| Personalized Watch List	| ✅ Completed	|Save videos to a personalized watch list.|
| Dynamic Removal	| ✅ Completed	|Easily remove videos from the watch list.|
| Comprehensive Admin Dashboard	| ✅ Completed	|Centralized control of the platform.|
| Multi-Section Management	| ✅ Completed	|Manage Games, Videos, Playlists, Users, Design, Features, and Application Properties.|

</details>


### Tech Stack and Integrations
<details>
  <summary> Click here to expand </summary>


| Feature	| Status	| Notes| 
|---------|---------|--------|
| Java Spring Boot	| ✅ Implemented	| Backend framework.| 
| React with TypeScript	| ✅ Implemented	| Frontend framework.| 
| MongoDB	| ✅ Implemented	| Database.| 
| Nginx (Reverse Proxy)	| ✅ Implemented	| Reverse Proxy setup.| 
| RabbitMQ Integration	| 🔜 Planned	| For asynchronous messaging and scalability.| 

</details>


### Planned Enhancements
<details>
  <summary> Click here to expand </summary>

| Feature	| Status	| Notes| 
|---------|---------|--------|
| Standalone Installation	| 🔜 Planned	| `.exe` for Windows and `.deb` for Linux.| 
| Enhanced Video Analytics	| 🔜 Planned	| Deeper insights into user engagement and watch patterns.| 
| Advanced UI Theming	| 🔜 Planned	| Customization of color schemes, layouts, and more.| 

</details>


## Features
### UX
- Community Module: Users can create and participate in discussions, comment on topics, and filter topics by title, games and videos.
- Video Streaming: Stream videos with support for HLS playback (Currently bugged).
- Playlists: Create and manage playlists, sort by name or genre, and view total videos and duration.
- Watch History: Track watched videos with details like view count, duration, and upload date.
- Watch List: Save videos to a watch list for later viewing.
- User Settings: Update username, email, password, and profile picture.
- (Planned) Login: OAuth login support for Google and Twitch, currently only supports custom login.

## Admin Tools
- Admin Panel: Centralized management of the platform with the following sections:
  - Game Management
  - Video Management
  - Playlist Management
  - User Management
  - Design Settings
    - Change the platform's color scheme, title, and other design elements.
  - Feature Management
    - Enable or disable features like community (Create topics, Comments etc.) or limit it for specific users.
  - Application Properties Management
    - Set streaming resource folder, video storage path, and other application properties.

## Tech Stack
- Backend: <img src="https://img.shields.io/badge/-Java-007396?style=for-the-badge&logo=java&logoColor=white" /> <img src="https://img.shields.io/badge/-Spring%20Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" /> Java Spring Boot
- Frontend: <img src="https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> React with TypeScript and Material UI
- Database: <img src="https://img.shields.io/badge/-MongoDB-007ACC?style=for-the-badge&logo=mongodb&logoColor=white" /> MongoDB
- Reverse Proxy: <img src="https://img.shields.io/badge/-NGINX-007ACC?style=for-the-badge&logo=nginx&logoColor=white" /> Nginx
- Planned Integration: <img src="https://img.shields.io/badge/-RabbitMQ-007ACC?style=for-the-badge&logo=rabbitmq&logoColor=white" /> RabbitMQ

## UI Overview
### Community Module
The Community module allows users to:

- Create Topics: Users can create topics related to games or videos.
- Comment on Topics: Add and manage comments on each topic.
- Search and Filter: Filter by title, creator, or related games/videos.
- Dynamic Navigation: Navigate to video pages directly from community discussions.
### Login
- <span style="color: red">(Planned)</span>  OAuth Integration: Support for Google and Twitch OAuth login.
- Local Authentication: Standard email and password login with JWT storage in localStorage.
### Playlists
- Playlist Management: Create, sort, and search playlists.
- Video Playback: HLS video streaming with custom player controls.
- Watch List Integration: Add or remove videos from the watch list.
### Playlist Videos
- Video Thumbnails: Display thumbnails for each video in a playlist.
- Responsive Design: Adaptive grid layout for various screen sizes.
- Hover Effects: Interactive hover effects for a modern UI experience.
### User Settings
- Profile Management: Change username, email, and password.
- Profile Picture Upload: Upload and preview profile pictures.
- Dynamic Update: Real-time updates for user settings without page refreshes.
### Videos
- Video Library: Browse and filter videos by name, game, or playlist.
- Dynamic Filtering and Sorting: Real-time search and sorting options.
- Watch Time Tracking: Track watch time for personalized analytics.
### Watch History
- View History: List of previously watched videos.
- Interactive Navigation: Navigate directly to the watched video from history.
- Responsive Design: Optimized for both desktop and mobile views.
### Watch List
- Personalized Watch List: Save videos to a personalized watch list.
- Dynamic Removal: Easily remove videos from the watch list.
- Interactive UI: Hover effects and smooth transitions for better UX.
### Admin Panel
- Comprehensive Admin Dashboard: Centralized control of the platform.
- Multi-Section Management:
  - Game Management
  - Video Management
  - Playlist Management
  - User Management
  - Design Settings
  - Feature Management
  - Application Properties Management

## ⚠️ Limitations
- The primary limitation is your hardware or server capacity, Streamify is designed to utilize the resources you provide.
- Advanced UI theming is planned but currently limited to basic color and title customization.

## License
This project is licensed under the MIT License.