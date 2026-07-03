// ─── FLOW SCHOOL SONG DATABASE ───────────────────────────────────────────────
//
// Each song entry:
//   id      — unique number (increment from last entry)
//   title   — song title
//   artist  — artist name
//   bpm     — beats per minute (integer)
//   dur     — duration in seconds (integer)  e.g. 3:45 = 225
//   energy  — energy level 0–100
//             10–25   Begin In / Savasana
//             26–50   Warm Up
//             51–72   Build
//             73–96   Peak
//             38–60   Cool Down
//
// To add a song: copy any row, increment the id, fill in the fields.
// ─────────────────────────────────────────────────────────────────────────────

const SONGS = [
  { id:1,  title:'Night Bell (Arizona)',          artist:'Kerala Dust',                    bpm:94,  dur:449, energy:44 },
  { id:2,  title:'The Art of Making Love',        artist:'Big Words',                      bpm:78,  dur:171, energy:38 },
  { id:3,  title:'Never Enough',                  artist:'TWO LANES',                      bpm:120, dur:272, energy:58 },
  { id:4,  title:'Veiled Grey',                   artist:'Christian Löffler',              bpm:122, dur:350, energy:52 },
  { id:5,  title:'Behind the World',              artist:'Balmorhea',                      bpm:72,  dur:246, energy:18 },
  { id:6,  title:'Glassworks: I. Opening',        artist:'Philip Glass',                   bpm:111, dur:385, energy:28 },
  { id:7,  title:'Slow',                          artist:'Henry Green',                    bpm:82,  dur:187, energy:32 },
  { id:8,  title:'Heavy',                         artist:'Haux',                           bpm:80,  dur:181, energy:30 },
  { id:9,  title:'Oh No',                         artist:'Biig Piig',                      bpm:83,  dur:165, energy:46 },
  { id:10, title:'Every High',                    artist:'Kyson',                          bpm:92,  dur:213, energy:48 },
  { id:11, title:"I Don't Know",                  artist:'Nick Hakim',                     bpm:85,  dur:300, energy:42 },
  { id:12, title:'Take Me Away',                  artist:'Austin Farwell',                 bpm:70,  dur:97,  energy:18 },
  { id:13, title:'Promise',                       artist:'Ben Howard',                     bpm:120, dur:384, energy:40 },
  { id:14, title:'Free Form (Night Edit)',         artist:'Alex Lustig',                    bpm:88,  dur:144, energy:34 },
  { id:15, title:'Without You',                   artist:'Lapalux, Kerry Leatham',         bpm:86,  dur:326, energy:45 },
  { id:16, title:'Oceans',                        artist:'RY X, Ólafur Arnalds',           bpm:75,  dur:280, energy:30 },
  { id:17, title:'Dream',                         artist:'Alex Lustig',                    bpm:80,  dur:159, energy:28 },
  { id:18, title:'Run',                           artist:'ItsArius, Dinia',                bpm:92,  dur:210, energy:50 },
  { id:19, title:'2am',                           artist:'Aaron Hibell',                   bpm:138, dur:158, energy:64 },
  { id:20, title:'Nevada',                        artist:'Kerala Dust',                    bpm:98,  dur:363, energy:54 },
  { id:21, title:'Solitude Beauty (Meditation)',  artist:'Ambiosis',                       bpm:60,  dur:166, energy:8  },
  { id:22, title:'Ribs',                          artist:'Lorde',                          bpm:128, dur:259, energy:68 },
  { id:23, title:'Close (Your eyes)',             artist:'Viken Arman',                    bpm:105, dur:160, energy:42 },
  { id:24, title:'Waking Signal',                 artist:'Blackboxx',                      bpm:108, dur:292, energy:48 },
  { id:25, title:'Held',                          artist:'Kiasmos',                        bpm:120, dur:301, energy:58 },
  { id:26, title:'Folds',                         artist:'Thrupence',                      bpm:82,  dur:194, energy:34 },
  { id:27, title:'Blooming in the Valley',        artist:'Omid Shabani',                   bpm:74,  dur:208, energy:22 },
  { id:28, title:'Hakea',                         artist:'Thrupence',                      bpm:76,  dur:185, energy:28 },
  { id:29, title:'Passage',                       artist:'Garth Stevenson',                bpm:68,  dur:386, energy:16 },
  { id:30, title:'Finding',                       artist:'Re:um',                          bpm:72,  dur:117, energy:20 },
  { id:31, title:'Lone Wolf',                     artist:'East Forest',                    bpm:70,  dur:182, energy:18 },
  { id:32, title:'I Heard You From Afar',         artist:'Benjamin Gustafsson',            bpm:72,  dur:141, energy:16 },
  { id:33, title:'sun kissed',                    artist:'Yung Beathoven, Sleepless Society', bpm:78, dur:133, energy:26 },
  { id:34, title:'red wine',                      artist:'Yung Beathoven, Sleepless Society', bpm:76, dur:131, energy:24 },
  { id:35, title:'luna',                          artist:'Akira Kosemura',                 bpm:66,  dur:188, energy:12 },
  { id:36, title:'Lunar Rainbow',                 artist:'Eskimotion',                     bpm:88,  dur:228, energy:38 },
  { id:37, title:'Them',                          artist:'Nils Frahm',                     bpm:80,  dur:240, energy:26 },
  { id:38, title:'Obrecht',                       artist:'Analogue Dear',                  bpm:72,  dur:216, energy:20 },
  { id:39, title:'Farewell',                      artist:'Garth Stevenson',                bpm:64,  dur:328, energy:14 },
  { id:40, title:'Emerge',                        artist:'East Forest',                    bpm:68,  dur:130, energy:14 },
  { id:41, title:'End of Sky',                    artist:'Hang Massive',                   bpm:100, dur:497, energy:46 },
  { id:42, title:'Breathing Space',               artist:'Sacred Earth',                   bpm:62,  dur:485, energy:10 },
  { id:43, title:'Pure Space',                    artist:'Sol Rising',                     bpm:88,  dur:329, energy:40 },
  { id:44, title:'Let Me In',                     artist:'Sean Angus Watson',              bpm:78,  dur:181, energy:28 },
  { id:45, title:'The Light',                     artist:'Sol Rising',                     bpm:92,  dur:215, energy:44 },
  { id:46, title:'Opening',                       artist:'Essie Jain',                     bpm:72,  dur:257, energy:18 },
  { id:47, title:'The Southern Sea',              artist:'Garth Stevenson',                bpm:66,  dur:539, energy:12 },
  { id:48, title:'Morning Glory',                 artist:'Desmond Cheese',                 bpm:84,  dur:106, energy:30 },
  { id:49, title:'Mars',                          artist:'Beauvois',                       bpm:92,  dur:243, energy:46 },
  { id:50, title:'20:17',                         artist:'Ólafur Arnalds, Nils Frahm',    bpm:78,  dur:355, energy:24 },
  { id:51, title:'Grow - A COLORS ENCORE',        artist:'Facesoul',                       bpm:82,  dur:207, energy:40 },
  { id:52, title:'Peace of Mind',                 artist:'AK, Liam Thomas',               bpm:86,  dur:210, energy:38 },
  { id:53, title:'So Free',                       artist:'Alex Serra',                     bpm:96,  dur:252, energy:52 },
  { id:54, title:'Illuminar',                     artist:'Poranguí',                       bpm:98,  dur:292, energy:54 },
];
