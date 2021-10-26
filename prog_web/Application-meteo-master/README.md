# Application météorologique

Les fonctionnalités du site sont les suivantes :

1. Possibilité de trouver sa ville avec la première barre de recherche, en tapant le nom de la ville. Les villes avec, ou sans caractères spéciaux sont quand même retrouvées. Pour les villes dont le nom apparaît plusieurs fois dans un pays (par exemple, il existe deux Blanquefort, un dans le 32, et un dans le 33), se référer à la deuxième barre de recherche.

2. Possibilité de trouver sa ville, ou toutes les villes associées à un code postal avec la deuxième barre de recherche. Je vous conseille d'utiliser les codes postaux 33290, ou 88500 dans le cas extrême vu le nombre de villes associées. 
Si le code postal ne désigne qu'une ville, alors seules les données météorologiques de la ville trouvée sont affichées directement. Si le code postal désigne plusieurs villes, dans ce cas, vous seriez amené à choisir dans une liste déroulante la ville que vous souhaitez.

3. Possibilité de récupérer la météo en un endroit sur la carte, en cliquant dessus, grâce à la latitude et à la longitude récupérée. Les conditions actuelles météo sur la carte seront affichées dans tous les cas, sans clic si vous entrez le nom d'une ville ou d'un code postal, et avec clic.

4. A la suite des cas 1., 2. et 3., lorsque la ville ou le lieu (longitude/latitude) est trouvé, toutes les données liées sont affichées :
- Le nom de la ville, ainsi que son pays.
- Les conditions actuelles (température, vent, conditions commentées).
- Un tableau prévisionnel sur 5 jours en comptant le jour actuel, contenant un ensemble de données météorologiques toutes les 2h du jour sélectionné (Température, pression, humidité, etc...). Vous pouvez cliquer sur le jour souhaité au-dessus du tableau afin d'avoir les données liées à ce jour précisément.
- Si la ville a été trouvée par une des deux barres de recherche, elle est affichée sur la carte par un point géographique.

5. Une fonctionnalité de sauvegarde a été implémentée, afin de pouvoir garder les conditions actuelles des deux dernières villes choisies. Ce qui fait que l'on peut avoir la météo de deux villes en même temps, en plus des météos affichées sur la carte.

6. Deux graphes ont été implémentés :
- Le premier sur les températures de la journée sélectionnée à partir du tableau, sur des données toutes les 2h.
- Le deuxième par rapport à l'endroit que vous avez choisi, et le graphe se charge d'afficher les températures minimales et maximales pour chaque jour de la semaine.

Note du projet reçu : 18/20