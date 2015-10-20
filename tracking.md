| Category | Type | Name | Value | Label | Description |
|----------|------|------|-------|-------|-------------|
| **loading** | timing | doc-ready-time | *ms* | | time to documentReady event |
|             | timing | words-ready-time | *ms* | | time to words loaded and visible |
|             | event | doc-ready-time | *ms* | | time to words loaded and visible |
|             | event | words-ready-time | *ms* | | time to words loaded and visible |
| **circle** | event | play-click-no-combo | | `dragged-before | no-dragged-before` | clicked on non-active play |
|            | event | drop-word | | *word* | when word dropped into the circle |
|            | event | drop-word-miss | | *word* | when word dropped not in the circle |
|            | event | move-word-out | | *word* | when word moved out of the circle |
|            | event | combo | | *word,word,...* | when user enables a combo |
|            | event | first-combo | *ms* | *word,word,...* | when user enables a combo the first time, where *ms* is the from from page load |
|            | event | first-drag | *ms* | | first successful word drag, where *ms* is time from page load |
|            | event | first-drag-seen-ghosts | *n* | | first successful word drag, where *n* the number of ghosts seen before |
|            | timing | time-to-first-drag | *ms* | | time to figure out dropping words into the circle |
|            | timing | ghosts-before-first-drag | *number* | | number of word ghosts shown before the first drag |
|            | timing | time-to-first-combo | *ms* | | time to enable the first combo |
| **video** | event | play | | *videoID* | play button hit on video |
|           | event | card-open-shared | | *videoID* | hit on a shared card |
|           | event | card-shared-play | | *videoID* | clicked on play button of shared card |
|           | event | card-show | *t* | *videoID* | show card on *t* second of a video |
|           | event | card-close-click | *t* | *videoID* | close card on *t* second of a video |
|           | event | card-next | *t* | *videoID* | next background |
|           | event | card-prev | *t* | *videoID* | prev background |
|           | event | card-fbshare | *t* | *videoID* | clicked facebook share on a card |
|           | event | card-fbshare-bg | *t* | *cardImg* | clicked facebook share on a card (by card bg index) |
|           | event | card-fbshare-window-open | *ms* | *videoID* | facebook share window opened, where *ms* is time to upload the card image |
|           | event | esc | | *videoID* | ESC button clicked, close video |
|           | event | close-button-click | | *videoID* | close button clicked |
|           | event | youtube-api-ready | *ms* | | youtube iframe api has been loaded, *ms* is time it took to load |
|           | event | bg-load | *ms* | *cardImg* | card bg has been loaded, where *ms* is time it took to load |
|           | timing | youtube-api-ready | *ms* | | time to youtube iframe api loaded |
|           | timing | card-upload-time | *ms* | *cardImg* | time to upload the card before fb share window appear |
|           | timing | bg-load-time | *ms* | *cardImg* | time load card background image |
| **Facebook** | | Send | *videoID* | | facebook share button clicked on card |
| **ui**    | event | show-menu | | | opened left menu |
