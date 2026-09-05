# 2026 Primos Trivia Derby

A multiplayer trivia horse race for setting the 2026 Primos Fantasy League draft order.

## What it does

- Exactly 10 managers join from their phones before the host starts the race.
- The host opens `/host` on a laptop/TV.
- Everyone sees the same trivia question.
- Correct answer = **10 yards**.
- First three correct answers on a question receive a **+3 / +2 / +1 yard speed bonus**.
- First horse to 100 yards receives **Draft Pick #1**.
- The race continues until every manager receives a draft position. If the 30-question bank ends before every horse reaches 100, the remaining positions are ranked by total yards; exact yardage ties are broken randomly.
- Host screen automatically advances every 20 seconds, or the host can press **Next**.

## Before deploying: create the Supabase database

Vercel hosts the website. Supabase stores the shared multiplayer room so all phones and the TV stay synchronized.

1. Create a free account/project at Supabase.
2. Open **SQL Editor** in the Supabase dashboard.
3. Open the file `supabase/schema.sql` from this project.
4. Copy the entire SQL file into Supabase SQL Editor and run it once.
5. In Supabase, open **Project Settings -> API**.
6. Copy:
   - Project URL
   - `service_role` key (keep this secret)

## Upload this project to GitHub

1. Unzip this package on your computer.
2. Open your GitHub repository `primos-trivia-derby`.
3. Choose **Add file -> Upload files**.
4. Drag **everything inside this folder** into GitHub.
5. Commit the files.

Do not upload only the ZIP. Upload the files and folders inside it.

## Deploy with Vercel

1. In Vercel choose **Add New -> Project**.
2. Import your `primos-trivia-derby` GitHub repository.
3. Before deploying, open **Environment Variables** and add:

   `SUPABASE_URL` = your Supabase Project URL

   `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service_role key

4. Deploy.
5. Vercel will give you a public URL, such as:

   `https://primos-trivia-derby.vercel.app`

## Draft night

### TV / Host
Open:

`https://YOUR-SITE.vercel.app/host`

Create a room such as `PRIMOS26`.

### Managers
Send everyone the invite link displayed on the host screen, or have them open:

`https://YOUR-SITE.vercel.app`

They enter the room code and their manager name.

## Change trivia questions

Edit `lib/questions.js`.

Each question looks like:

```js
{
  category: 'NFL',
  question: 'Question text?',
  options: ['A','B','C','D'],
  answer: 2
}
```

`answer` is zero-based: `0` = first choice, `1` = second choice, etc.

## Security note

The Supabase `service_role` key is used only by Vercel server routes. It is never sent to player browsers. Each player also receives a private random session token so another manager cannot submit answers as them just by seeing the public race state. Never commit your real key into GitHub; keep it in Vercel Environment Variables.
