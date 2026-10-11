# indydxg music archive

A no-build, responsive, monochrome Y2K/underground music archive for GitHub Pages. It uses plain HTML, CSS, and JavaScript, with a custom audio player.

## Before publishing

- [ ] Replace `YOUR RELEASE TITLE`, track names, type, and year in `script.js`.
- [ ] Add only released/public tracks to this website.
- [ ] Add the matching MP3 files to `music/` and update each `src` path in `script.js`.
- [ ] Add cover art to `covers/` and set each release's `cover` path.
- [ ] Replace the placeholder SoundCloud/Bandcamp/GitHub links in `index.html`.
- [ ] Check that no private demos, unreleased music, passwords, or personal files are in this public repository.

## Add tracks

1. Put an MP3 file in `music/`, for example `music/my-song.mp3`.
2. Open `script.js`.
3. Add a track object under the correct release:

```js
{
  title: "My Song",
  src: "music/my-song.mp3",
  format: "MP3"
}
```

4. Save and commit the changes. The track will appear on the website automatically.

The starter tracks are placeholders; replace their names and paths before publishing. WAV files can be linked if you choose, but for public listening, MP3 is usually more bandwidth-friendly. Keep WAV masters in your private archive and a separate offline backup.

## Add another release

Add another object to the `releases` array in `script.js`:

```js
{
  title: "Release Name",
  type: "EP",
  year: "2026",
  cover: "covers/release-name.jpg",
  tracks: [
    {
      title: "Track Name",
      src: "music/track-name.mp3",
      format: "MP3"
    }
  ]
}
```

Keep commas between release objects. The final object in an array does not need a trailing comma.

## Publish on GitHub Pages (free)

1. Download and unzip this folder.
2. Sign in to GitHub and create a **new public repository** named `YOUR-USERNAME.github.io`, replacing `YOUR-USERNAME` with your GitHub username.
3. On the new repository page, choose **Add file → Upload files**.
4. Upload the contents of this folder (the `index.html`, `style.css`, `script.js`, `README.md`, `music`, and `covers` items). Upload the files themselves to the repository root; don't upload a second nested `indydxg-music-archive` folder.
5. Commit the upload.
6. Open **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select branch `main` and folder `/(root)`, then press **Save**.
9. Wait a few minutes, then open `https://YOUR-USERNAME.github.io/`.

GitHub Pages changes may take several minutes to publish. Its free-plan source repository and published site have size limits, so don't use it as an unlimited audio host. If the site grows, keep audio on a dedicated host and embed/link it here.

## Private archive — keep separate

Create a different repository named `indydxg-vault` and set it to **Private**. Store catalog notes and private material there. Do not upload unreleased audio to the public website repository. For valuable WAV masters, keep at least one additional copy outside GitHub (for example, an external drive).

**Privacy warning:** GitHub Pages sites are public. Anything committed to the public website repository should be treated as public, even if you later remove it from the visible files; old versions may remain in Git history.
