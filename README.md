# booru

A lightweight tag based image board.

![](docs/example.png)

## Notice

This project is in alpha. Installation and usage instructions will likely
change and essential functionality may be missing.

## Features

- Uses SQLite to store metadata - no database server needed!
- Simple single passphrase authentication
- Image thumbnail generation
- Tag search
- Clean and responsive layout (mobile friendly)
- Automatically extracts tags from NovelAI generated images (using a Danbooru filter)

## Installation

1. Ensure [Docker](https://docs.docker.com/engine/install/) is installed. If you do
   not wish to use Docker, try following the **Development** instructions below.

2. Clone this repository:

   ```
   git clone https://github.com/p4ckysm4cky/booru.git
   ```

3. Build the container:

   ```
   docker build -t booru ./booru
   ```

4. Run the container:

   ```
   docker run \
   --publish $PORT:$PORT
   --env PORT=$PORT \
   --env SECRET=$SECRET \
   --env PASSWORD=$PASSWORD \
   --volume "$(pwd)"/booru/data:/app/data \
   --detach -t booru
   ```

   replacing `$PORT` with the port to expose the server on, `$SECRET` with
   a random string, and `$PASSWORD` with a password.

5. Access the site on `http://localhost:$PORT`.

## Development

1. Clone this repository:

   ```
   git clone https://github.com/p4ckysm4cky/booru.git
   ```

2. Enter the repository directory:

   ```
   cd booru
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Ensure the database has been migrated to the latest version:

   ```
   npm run migrate
   ```

5. Start the development server:

   ```
   npm run dev
   ```

Open <http://localhost:3000> with your browser to view the app.

To access authenticated routes, set these environment variables
(in a `.env.local` file or otherwise):

- `SECRET`
- `PASSWORD`

## Optional configuration

### Prevent indexing

To prevent search engines (such as Google) from indexing the site, add the
`NEXT_PUBLIC_NO_INDEX` argument to the Docker build command:

```
docker build --build-arg NEXT_PUBLIC_NO_INDEX=true ...
```
