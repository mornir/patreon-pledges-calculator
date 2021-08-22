# Patreon Pledges Calculator

> Find out how much money you've pledged to each Patreon creator.

<img width="277" alt="screenshot" src="https://user-images.githubusercontent.com/1411843/130349351-a2145b0d-ae0f-4693-bda9-0aca4388c568.PNG">

## Introduction

On _patreon.com_, I didn't find a way to get an overview of my total pledges for the different creators I've been supporting. My search for 3rd party tools or applications also didn't bear fruits.

So I decided to quickly put together something myself. At first, I wanted to use the Patreon API, but it only lets you fetch pledges from _your_ patrons. This is actually a sensible approach for privacy reasons. The goal of the Patreon API is to let creators interact with their patrons and thus only get access to information that pertains to their creator account.

Then I thought about websites in the likes of _yiff.party_ that pull data from a user account. Basically those sites ask for a session key which they use to make an authenticated request on behalf of the user.

I wasn't a fan of that approach for 3 reasons:

1. As as user I wouldn't feel safe giving access to my account to a website that is not endorsed by Patreon.
2. The session id is stored inside a cookie. It means that I cannot make the request on the client side. I would need to use a proxy or a serverless function, which is definitely an overkill for this project.
3. Finding the session key doesn't provide for a great UX.

## My solution

When browsing my billing history on _patreon.com_, I noticed that data was fetched via an API and was in JSON format. By opening that endpoint directly in the browser, I could see the raw data.
My idea was then to let the user copy and paste that raw JSON data in my application, and then I would process it for visualization.

And the result works pretty well 😃
Look for yourself:
https://patreon-pledges-calculator.netlify.app
