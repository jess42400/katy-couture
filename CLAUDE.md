# RÈGLES KATY COUTURE

## 1. PHILOSOPHIE CSS RESPONSIVE

### Principe : ADAPTATIF INTELLIGENT

L'objectif est un rendu qui S'ADAPTE AUTOMATIQUEMENT à chaque écran.
Le navigateur calcule le meilleur layout, on n'impose pas de breakpoints fixes.

### Techniques à utiliser :
- `minmax()` pour les grilles → le navigateur calcule le nombre de colonnes
- `auto-fit` / `auto-fill` pour remplir l'espace disponible
- `clamp()` pour les tailles de texte fluides
- `%` et `vw/vh` au lieu de `px` fixes

### Exemple grille collection :
```css
grid-template-columns: repeat(auto-fit, minmax(220px, 300px));
justify-content: center;
```
→ Résultat : 2 col mobile, 3 col tablette, 4+ col PC, AUTOMATIQUEMENT

### Exceptions avec @media (quand nécessaire) :
- Page produit : 1 col mobile → 2 col PC (image|infos)
- Menu burger : 100% mobile → 350px max PC

## 2. HEADER (FIXE)
- Gauche : menu burger
- Centre : logo KATY COUTURE
- Droite : icônes (thème, recherche, panier)
- Ne change JAMAIS

## 3. THÈMES CLAIR/SOMBRE
- Tous éléments s'adaptent aux deux thèmes
- Utiliser les variables CSS Shopify

## 4. MÉTHODE DE TRAVAIL
1. Chercher d'abord avec grep avant de modifier
2. Montrer les changements (avant/après)
3. Vérifier mobile ET PC avant de valider
4. Ne jamais dire "c'est fait" sans preuve

## 5. RÈGLE ABSOLUE - SCOPE DES MODIFICATIONS
**NE JAMAIS modifier un fichier qui n'est pas directement lié à la demande.**

- Demande sur page produit → UNIQUEMENT fichiers produit
- Demande sur page collection → UNIQUEMENT fichiers collection
- Demande sur header → UNIQUEMENT fichiers header
- JAMAIS d'autres pages sans autorisation explicite

Fichiers autorisés par contexte :
- **Page produit** : `sections/main-product.liquid`, `assets/theme.css`
- **Page collection** : `sections/main-collection.liquid`, `assets/theme.css`
- **Header** : `sections/header.liquid`, `assets/theme.css`
- **Page d'accueil** : `templates/index.json`, `sections/*.liquid` de la home SEULEMENT si demandé

## 6. COMMITS DE SAUVEGARDE
**Après CHAQUE correction validée par l'utilisateur :**
1. Faire un commit : `git commit -am "SAVE: [description]"`
2. Ne JAMAIS faire `git checkout HEAD --` sur plusieurs fichiers sans demander
3. Avant de modifier, vérifier qu'on ne casse pas les corrections précédentes

Exemples :
- `"SAVE: Header centré + bandeau visible"`
- `"SAVE: Grille collection adaptative 300px max"`

## 7. COMMUNICATION
- Être HONNÊTE sur ce qui marche ou pas
- Demander si quelque chose manque
- Montrer les erreurs, ne pas les ignorer

## 8. DÉPLOIEMENT SHOPIFY
- Boutique : https://a0hc1i-fy.myshopify.com/
- Theme ID : 192766214491
- Après chaque modif : `shopify theme push --store a0hc1i-fy.myshopify.com --theme 192766214491 --allow-live`

## 9. CLASSES CSS PRINCIPALES
- `.products-grid` → Grille collection
- `.product__grid` → Layout page produit
- `.product-card` → Carte produit
- `.product__gallery` → Galerie image
- `.product__info` → Infos produit

## 10. RÈGLE SHOPIFY : UTILISER LES SECTIONS CONFIGURABLES

Quand tu modifies le thème Shopify :

1. **NE PAS hardcoder** des images/textes directement dans le code Liquid
2. **UTILISER les blocs et settings** Shopify pour que ce soit configurable dans le Customizer
3. Les images doivent être ajoutées via l'interface Shopify, pas dans le code

**EXEMPLE MAUVAIS :**
```liquid
<img src="cheche.jpg">  ← Hardcodé, pas visible dans Customizer
```

**EXEMPLE BON :**
```liquid
{{ block.settings.image | image_url | image_tag }}  ← Configurable dans Shopify
```

**Quand l'utilisateur veut ajouter/modifier une image ou du contenu :**
→ Lui dire de le faire dans **Shopify Admin > Personnaliser** au lieu de modifier le code directement.
