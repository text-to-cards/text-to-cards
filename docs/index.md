## What is Memo-to-Trello?

Memo-to-Trello is a simple Trello Power-Up, that helps transforming your longform written texts into neat little Trello cards. It will extract card names and descriptions from your text and add the proper labels, members and due date to the card.

You can create dozens of cards with just one click. Just as an example, this text will be turned into complete Trello cards:

```


```

### What's a Trello Power-Up?

Power-Ups are basically external plugins that enhance the funcionality of Trello. [Read more about Power-Ups here](https://help.trello.com/article/1094-what-are-power-ups).

## How to turn on Memo-to-Trello?

[Here's how you can turn on a Power-Up on Trello.](https://help.trello.com/article/810-enabling-power-ups).

In a nutshell:

1. Open up a board where you want to use Memo-to-Trello
2. Click __Show menu...__ in the top right corner
3. Click on __Power-Ups__ to open up the Power-Up marketplace
4. Search for __Memo-to-Trello__ in the top left corner (it's in the "Communication & Collaboration" section by the way).
5. Click on the icon, and __Add__ the Power-Up to your board.
6. Authorize by clicking on the __Memo-to-Trello__ button in the top menu of your board.

That's it, you can start using Memo-to-Trello.

## How does it work?

### 1. Add text
After opening up the Power-Up, copy and paste (or just simply type) your text into the large text area in the middle.

### 2. Mark the cards
Sprinkle your text with a few hints to point out the important parts of the cards you want to create. You will immediately see the live preview of the cards you are about to create.

### 3. Select the list
Select the list on your board where you want the new cards to be added. You can only add cards to an existing list on the board, so don't forget to create your new list before you add your memo, if necessary.

### 4. Add the cards
When you are ready, just click on the "Create cards" button and your shiny new cards will appear on your board.

## Card Hints

Memo-to-Trello uses the following hints to extract different parts of your cards (see details below):

- `::card title` to find cards and separate their title from description
- `@username` or `@initials` for members
- `#label` for labels
- `$due:` for due dates

#### `::card title`

Yes, that's a double colon at the beginning. This is the only required hint to define cards. Everything in the line after the double colon will be treated as the card title, anything after that - and before the next card or the end of your text - goes into the description of the card (if longer than 5 characters). Example:

```
::My shiny new card title

This goes into the description

::This is the next card title

And a new description for that
```

Alternatively, you can mark the end of the card title with a single `:`, so you can turn oneliners into proper cards with title and description. Example:

```
::A new card: This part will go into the description.
::Next card: And a description for it.

And this is still a description for the second card.
```

#### `@username` or `@initials`

If you want to add members to the card, just include their Trello username or initials starting with `@` anywhere in the description of the card. (Note: only already existing members will be extracted from the text). Example:

```
::A card with a user

This card is assigned to: @myfavouritecolleague
```

This will add `@myfavouritecolleague` to the card. You can add as many of your board members as you want.

#### `#label`

Add as many labels to the card as you wish by including them - starting with a `#` - anywhere in the description. (Note: only already existing labels can be added.) Example:

```
::My card with labels

Short description, but #lots #of #valuable #labels
```


#### `$due: YYYY-MM-DD`

To set the due date of a card, add the date after `$due:` in the description. Please note, that only the first occurence of `$due` is considered. Example:

```
::This is a card with due date

The description includes $due: 2020-12-31.
```

This will set the due date of the card to December 31, 2020.

## But what about my precious data?!

## About the creator
