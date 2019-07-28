# sudoku

[![](./public/img/sudoku.png?raw=true)](https://sudoku-415.herokuapp.com)

Ho scritto questo gioco dopo aver seguito per un po' i tutorial di [Daniel Shiffman](https://www.youtube.com/user/shiffman/featured) su p5js. 

Utilizzando questa libreria per i canvas ho scritto l'interfaccia utente, un generatore di schemi di sudoku e un solutore automatico.

il gioco è essenziale e non vengono memorizzati punteggi dei vari giocatori, ma il sistema ricorda l'ultima partita in corso e la memorizza dopo ogni mossa nel local storage

Istruzioni per l'installazione locale:  (occorre avere installato nodejs)

```
git clone https://github.com/liburno/sudoku-415.git
cd sudoku-415
nmp install
node server
```

ho inserito anche un server node express, perchè volevo gestire alcuni servizi remoti per la memorizzazione delle partite a punteggio più alto, la compilazione e pubblicazione automatica, ma poi ho cambiato idea per lasciare un progetto "semplice e pulito"






