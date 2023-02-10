---
title: Privacy Policy
---

# Privacy Policy

## Data provided by the user's browser

We do not directly record any navigation history, referral URLs, user IP addresses, User Agent
strings, or other browser information anywhere.

## Google Analytics

We use [Google Analytics][google-analytics], which in turn records user information and might
install its own cookies as per its own privacy policy (please refer to https://policies.google.com/
for more information).

We do not actively try to collect or retain Personally Identifiable Information, or PII, via Google
Analytics. If our Google Analytics setup actually collects or retains PII due to the way we
configured it or due to its default settings, we never try to profile or personally identify any
user. We are only interested in profiling the global set of EthernaLotto users anonymously, and we
do that in order to drive our internal product development and improve the user experience.

## MetaMask

The EthernaLotto website interacts with [MetaMask][metamask], a browser extension with its own
privacy policy.

Through MetaMask our code can access the public key (also known as the _address_) of one or more
user wallets. We never associate those addresses to any PII in any way. In particular, we never
record IP addresses.

Please refer to
[Information stored in our smartcontracts](#information-stored-in-our-smartcontracts) for
information about what we store in our smartcontracts (which include wallet addresses) and how we
use it.

## Disqus

We embed [Disqus][disqus] in some pages of our website but we do not query or retain any data from
it. All information collected by the Disqus widget is managed entirely by Disqus, so please refer to
[their privacy policy][disqus-privacy-policy].

## Custom cookies

We store cookies in the browser to remember user preferences, such as acceptance of this Privacy
Policy. These cookies are never stored in any server, only in the browser.

The ultimate purpose of the cookies we install is to improve the user experience. We do not intend
to profile or personally identify any user or set of users.

## Information stored in our smartcontracts

The EthernaLotto website is merely a frontend for a set of
[Ethereum smartcontracts][smartcontracts]. We do not use any server environments other than those
smartcontracts. Please refer to the [whitepaper][whitepaper] for detailed information on how they
work.

Whenever a user buys an EthernaLotto ticket we store the following pieces of information in our
smartcontracts: ticket data (the played numbers), user wallet address, and current timestamp. This
information is publicly viewable and allows anyone to determine what numbers a wallet bought and at
what time it did. As mentioned [above](#metamask), we never associate these pieces of information to
any PII.

In addition to buying tickets, some users may want to sign up for our
[Partnership Program][partners]. In that case the user's wallet address will be recorded in several
more places throughout our smartcontracts, but still anonymously. It is possible for anyone to
determine whether a given wallet address participates in the Program by checking its ELOT token
balance. The user will also earn fees as a result of participating in the Program; all earnings
associated to the user's wallet are recorded in the blockchain and publicly viewable.

[disqus]: https://disqus.com/
[disqus-privacy-policy]: https://help.disqus.com/en/articles/1717103-disqus-privacy-policy
[google-analytics]: https://analytics.google.com/
[metamask]: https://metamask.io/
[partners]: /partners
[smartcontracts]: https://ethereum.org/en/smart-contracts/
[whitepaper]: /whitepaper
