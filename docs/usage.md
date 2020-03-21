## Create cards from text

### Add text

After opening up the Power-Up, copy and paste (or just simply type) your text into the large text area in the middle.

### Mark the cards

Sprinkle in a [few hints](#card-hints) to point out the the cards you want to create (you can of course add these before copying your text). You will immediately see the live preview of the cards you are about to create.

### Select the list

Select the list on your board where you want to add the cards. You can only add cards to an existing list on the board, so don't forget to create your new list before you add your cards, if necessary.

### Add the cards

When you are ready, just click on the __Create cards__ button and your shiny new cards will appear on your board.

## Card Hints

Text to Cards uses the following hints to extract different parts of your cards (see details below):

- [`::card title`](#card-title) to find cards and separate their title from description
- [`@username` or `@initials`](#username-or-initials) for members
- [`#label` or #{label with space or special char}](#label) for labels
- [`$due:`](#usddue-YYYY-MM-DD) for due dates

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

#### `#label` or `#{label with spaces or special characters}`

Add as many labels to the card as you wish by including them - starting with a `#` - anywhere in the description. If your label contains whitespaces and/or special characters (anything besides letters and numbers), put it in curly braces, like `#{label with whitespaces}`. You can only add labels that already exist on the table.

Example:

```
::My card with labels

Short description, but #lots #of #valuable #labels #{with whitespaces} and #{special.characters!}
```

`#label` will also be replaced with `\#label` to "escape" the `#` sign so Trello's markdown processor won't turn any labels into `H1` headings.


#### `$due: YYYY-MM-DD`

To set the due date of a card, add the date after `$due:` in the description. Please note, that only the first occurence of `$due` is considered, and you have to follow the `YYYY-MM-DD` format. Example:

```
::This is a card with due date

The description includes $due: 2020-12-31.
```

This will set the due date of the card to December 31, 2020.
