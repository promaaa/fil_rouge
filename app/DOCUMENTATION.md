# Documentation Technique - Application MAKER LENS

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture de l'application](#architecture-de-lapplication)
3. [Spécifications techniques](#spécifications-techniques)
4. [Structure des écrans](#structure-des-écrans)
5. [Composants UI détaillés](#composants-ui-détaillés)
6. [Flux de navigation](#flux-de-navigation)
7. [Guide de conversion Kotlin/Java](#guide-de-conversion-kotlinjava)

---

## 📱 Vue d'ensemble

**Nom de l'application :** MAKER LENS  
**Tagline :** "Une nouvelle manière de percevoir les objets qui nous entourent"  
**Type :** Application mobile de tutoriels DIY (Do It Yourself) et recyclage  
**Technologie actuelle :** Python + Kivy  
**Cible de conversion :** Android (Kotlin ou Java natif)

### Objectif de l'application
L'application permet aux utilisateurs de :
- Trouver des tutoriels pour créer des objets avec des techniques low-tech
- Découvrir des moyens de recycler et donner une seconde vie aux objets
- Obtenir des suggestions de projets personnalisés

---

## 🏗️ Architecture de l'application

### Structure générale
```
MakerLensApp
├── ScreenManager (gestion des écrans)
│   ├── CreationScreen (écran de création)
│   ├── RecyclageScreen (écran de recyclage)
│   └── SuggestionsScreen (écran de suggestions)
└── BaseScreen (classe parente avec header et navbar)
```

### Technologies Python actuelles
- **Framework UI :** Kivy 2.3.1
- **Gestion d'écrans :** ScreenManager avec SlideTransition
- **Layouts principaux :** BoxLayout, AnchorLayout, FloatLayout
- **Widgets :** Button, Label, TextInput, Image

---

## 📐 Spécifications techniques

### Dimensions et couleurs

#### Fenêtre
```python
Window.size = (360, 640)  # Format vertical smartphone
Window.clearcolor = (0.91, 0.88, 0.84, 1)  # Fond beige/crème
```
**Conversion :** 360dp x 640dp, Couleur de fond : #E8E0D6

#### Palette de couleurs
```python
PRIMARY_COLOR = (0.06, 0.24, 0.18, 1)    # Vert foncé #0F3D2E
SECONDARY_COLOR = (0.75, 0.75, 0.75, 1)  # Gris clair #BFBFBF
SELECTED_COLOR = (0.70, 0.8, 1, 1)       # Bleu clair #B3CCFF
TEXT_COLOR = (0, 0, 0, 1)                # Noir #000000
```

#### Espacements standards
- Padding global des écrans : 15dp
- Spacing entre éléments : 10dp
- Hauteur header : 150dp
- Hauteur navbar : 55dp
- Hauteur boutons navbar : 40dp
- Logo : 110dp x 110dp

---

## 📱 Structure des écrans

### 1. BaseScreen (Classe abstraite)

#### Composants communs

##### A. Header avec logo superposé
```
┌─────────────────────────────────┐
│ 🖼️ Logo              MAKER LENS │  150dp hauteur
│ (110x110dp)                     │
│           Tagline centré        │
└─────────────────────────────────┘
```

**Spécifications du logo :**
- Taille : 110dp x 110dp
- Position : Coin supérieur gauche
- Padding : 10dp depuis les bords
- Source : `logo.png`
- Superposition avec FloatLayout

**Spécifications des textes :**
- Titre "MAKER LENS" : 
  - Font size : 21sp
  - Style : Bold
  - Couleur : PRIMARY_COLOR (#0F3D2E)
  - Alignement : Centré
  
- Sous-titre :
  - Texte : "Une nouvelle manière de percevoir les objets qui nous entourent"
  - Font size : 11.5sp
  - Couleur : TEXT_COLOR (#000000)
  - Alignement : Centré

##### B. Barre de navigation (NavBar)
```
┌─────────────────────────────────┐
│   [Création]  [Recyclage]       │  55dp hauteur
└─────────────────────────────────┘
```

**Spécifications :**
- Hauteur totale : 55dp
- Conteneur des boutons : 80% de la largeur, centré
- Hauteur des boutons : 40dp
- Spacing entre boutons : 12dp
- Font size : 15sp

**États des boutons :**
- Actif : background_color = SELECTED_COLOR (#B3CCFF)
- Inactif : background_color = SECONDARY_COLOR (#BFBFBF)
- Couleur du texte : TEXT_COLOR (#000000)

---

### 2. CreationScreen (Mode Création)

#### Structure complète
```
┌─────────────────────────────────┐
│        HEADER (150dp)           │
├─────────────────────────────────┤
│        NAVBAR (55dp)            │
├─────────────────────────────────┤
│                                 │
│   [Mode création] (bold)        │
│                                 │
│   Description du mode           │
│   (centré, multi-ligne)         │
│                                 │
│   ┌───────────────────────┐    │
│   │ Quel objet souhaitez- │    │
│   │ vous créer ?          │    │
│   │ Ex : Lampes,          │    │ 100dp hauteur
│   │ horloges, ...         │    │
│   └───────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

#### Contenu principal (centré verticalement)

**Zone de contenu :**
- Alignement vertical : center (AnchorLayout)
- Largeur : 90% de l'écran
- Hauteur totale : 230dp

**Éléments :**

1. **Titre du mode**
   - Texte : "Mode création"
   - Style : Bold
   - Font size : 17sp
   - Couleur : TEXT_COLOR
   - Alignement : Centré

2. **Description**
   - Texte : "Trouvez des tutoriels pour fabriquer vos propres objets avec des techniques low-tech."
   - Font size : 13sp
   - Couleur : TEXT_COLOR
   - Alignement : Centré
   - Max width : 300dp

3. **Zone de saisie (TextInput)**
   - Placeholder : "Quel objet souhaitez-vous créer ?\nEx : Lampes, horloges, ..."
   - Hauteur : 100dp
   - Background : Blanc (#FFFFFF)
   - Foreground : Noir (#000000)
   - Padding : 10dp sur tous les côtés
   - Multiline : true
   - **Action :** Appui sur Entrée → Navigation vers SuggestionsScreen

---

### 3. RecyclageScreen (Mode Recyclage)

#### Structure
Identique à CreationScreen avec les différences suivantes :

**Éléments spécifiques :**

1. **Titre du mode**
   - Texte : "Mode recyclage"

2. **Description**
   - Texte : "Donnez une seconde vie à vos objets grâce aux tutoriels de recyclage."

3. **Zone de saisie**
   - Placeholder : "Décrivez l'objet que vous souhaitez recycler\nEx : Bouteilles en plastique, chaise en bois, ..."

4. **État de la navbar**
   - Bouton "Recyclage" : actif (SELECTED_COLOR)
   - Bouton "Création" : inactif (SECONDARY_COLOR)

---

### 4. SuggestionsScreen (Écran de suggestions)

#### Structure
```
┌─────────────────────────────────┐
│   Suggestion de projets en      │  80dp hauteur
│   lien avec votre projet        │  (header)
├─────────────────────────────────┤
│                                 │
│                                 │
│         (Zone vide)             │
│      À implémenter :            │
│   Liste des suggestions         │
│                                 │
│                                 │
└─────────────────────────────────┘
```

#### Spécifications

**Header :**
- Hauteur : 80dp
- Background : Même que le fond principal (#E8E0D6)
- Padding : 20dp (tous côtés)

**Titre :**
- Texte : "Suggestion de projets en lien avec votre projet"
- Style : Bold
- Font size : 15sp
- Couleur : TEXT_COLOR (#000000)
- Alignement : Centré
- Max width : 320dp

**Zone de contenu :**
- Actuellement vide (BoxLayout vertical)
- À implémenter : Liste scrollable de suggestions

---

## 🔄 Flux de navigation

### Diagramme de navigation
```
     CreationScreen
           ↕
     RecyclageScreen
           ↓
    (Appui sur Entrée)
           ↓
   SuggestionsScreen
```

### Transitions

#### Navigation horizontale (Création ↔ Recyclage)
- Type : SlideTransition
- Durée : 0.25 secondes
- Direction : left

#### Navigation vers suggestions
- Déclencheur : Événement `on_text_validate` sur TextInput
- Condition : Le texte n'est pas vide (`text.strip()`)
- Écran cible : "suggestions"
- Transition : SlideTransition

### Gestion des événements

#### Boutons de navigation
```python
# CreationScreen
btn_recyclage.bind(on_press=go_recyclage)
def go_recyclage(instance):
    self.manager.current = "recyclage"

# RecyclageScreen
btn_creation.bind(on_press=go_creation)
def go_creation(instance):
    self.manager.current = "creation"
```

#### Validation de saisie
```python
def on_text_validate(instance):
    if instance.text.strip():  # Vérifier que le texte n'est pas vide
        self.manager.current = "suggestions"

input_box.bind(on_text_validate=on_text_validate)
```

---

## 🔧 Composants UI détaillés

### Layout Hierarchy

#### CreationScreen / RecyclageScreen
```
BoxLayout (vertical, root)
├── FloatLayout (header - 150dp)
│   ├── AnchorLayout (textes centrés)
│   │   └── BoxLayout (vertical)
│   │       ├── BoxLayout (spacer - 75dp)
│   │       ├── Label (titre)
│   │       └── Label (sous-titre)
│   └── AnchorLayout (logo coin gauche)
│       └── BoxLayout (110x110dp)
│           └── Image (logo)
├── AnchorLayout (navbar - 55dp)
│   └── BoxLayout (horizontal, 80% width)
│       ├── Button (Création)
│       └── Button (Recyclage)
└── AnchorLayout (content - centré)
    └── BoxLayout (vertical, 90% width, 230dp)
        ├── Label (titre mode)
        ├── Label (description)
        └── TextInput (saisie)
```

#### SuggestionsScreen
```
BoxLayout (vertical, root)
├── AnchorLayout (header - 80dp)
│   └── BoxLayout (vertical)
│       └── Label (titre)
└── BoxLayout (content - vertical)
    └── (À implémenter : liste de suggestions)
```

---

## 📝 Guide de conversion Kotlin/Java

### Équivalences de composants

#### Layouts
| Kivy | Android (Kotlin/Java) |
|------|----------------------|
| BoxLayout (vertical) | LinearLayout (orientation="vertical") |
| BoxLayout (horizontal) | LinearLayout (orientation="horizontal") |
| AnchorLayout | FrameLayout ou ConstraintLayout |
| FloatLayout | FrameLayout ou RelativeLayout |

#### Widgets
| Kivy | Android (Kotlin/Java) |
|------|----------------------|
| Label | TextView |
| Button | Button ou MaterialButton |
| TextInput | EditText |
| Image | ImageView |
| ScreenManager | Fragment Navigation ou ViewPager2 |

#### Propriétés communes
| Kivy | Android XML |
|------|-------------|
| size_hint_y=None, height=dp(X) | android:layout_height="Xdp" |
| size_hint=(0.9, None) | android:layout_width="0dp" + weight |
| padding=[10, 10, 10, 10] | android:padding="10dp" |
| spacing=dp(10) | android:layout_marginTop="10dp" (entre éléments) |
| halign="center" | android:gravity="center_horizontal" |
| font_size="21sp" | android:textSize="21sp" |
| color=PRIMARY_COLOR | android:textColor="#0F3D2E" |
| multiline=True | android:inputType="textMultiLine" |

### Structure recommandée pour Android

#### 1. Navigation avec Fragments
```kotlin
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Configuration de la navigation
        val navController = findNavController(R.id.nav_host_fragment)
        setupActionBarWithNavController(navController)
    }
}

// Fragments
- CreationFragment
- RecyclageFragment  
- SuggestionsFragment
```

#### 2. Base Fragment pour header/navbar communs
```kotlin
abstract class BaseFragment : Fragment() {
    abstract fun getNavbarActive(): String
    
    protected fun setupHeader(view: View) {
        // Configuration du logo et des titres
    }
    
    protected fun setupNavbar(view: View) {
        // Configuration des boutons de navigation
        val btnCreation = view.findViewById<Button>(R.id.btn_creation)
        val btnRecyclage = view.findViewById<Button>(R.id.btn_recyclage)
        
        // Gestion des états actif/inactif
        updateNavbarState()
    }
}
```

#### 3. Gestion de la saisie avec validation
```kotlin
class CreationFragment : BaseFragment() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val inputBox = view.findViewById<EditText>(R.id.input_box)
        
        inputBox.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                val text = inputBox.text.toString().trim()
                if (text.isNotEmpty()) {
                    navigateToSuggestions()
                }
                true
            } else {
                false
            }
        }
    }
    
    private fun navigateToSuggestions() {
        findNavController().navigate(
            R.id.action_creation_to_suggestions
        )
    }
}
```

### Ressources Android

#### colors.xml
```xml
<resources>
    <color name="background">#E8E0D6</color>
    <color name="primary">#0F3D2E</color>
    <color name="secondary">#BFBFBF</color>
    <color name="selected">#B3CCFF</color>
    <color name="text">#000000</color>
    <color name="white">#FFFFFF</color>
</resources>
```

#### dimens.xml
```xml
<resources>
    <dimen name="header_height">150dp</dimen>
    <dimen name="navbar_height">55dp</dimen>
    <dimen name="navbar_button_height">40dp</dimen>
    <dimen name="logo_size">110dp</dimen>
    <dimen name="content_width_percent">0.9</dimen>
    <dimen name="content_height">230dp</dimen>
    <dimen name="input_height">100dp</dimen>
    <dimen name="standard_padding">15dp</dimen>
    <dimen name="standard_spacing">10dp</dimen>
    <dimen name="logo_padding">10dp</dimen>
    <dimen name="title_text_size">21sp</dimen>
    <dimen name="subtitle_text_size">11.5sp</dimen>
    <dimen name="mode_title_text_size">17sp</dimen>
    <dimen name="description_text_size">13sp</dimen>
    <dimen name="button_text_size">15sp</dimen>
</resources>
```

#### strings.xml
```xml
<resources>
    <string name="app_name">MAKER LENS</string>
    <string name="app_tagline">Une nouvelle manière de percevoir les objets qui nous entourent</string>
    
    <!-- Mode Création -->
    <string name="creation_title">Mode création</string>
    <string name="creation_description">Trouvez des tutoriels pour fabriquer vos propres objets avec des techniques low-tech.</string>
    <string name="creation_hint">Quel objet souhaitez-vous créer ?\nEx : Lampes, horloges, ...</string>
    
    <!-- Mode Recyclage -->
    <string name="recyclage_title">Mode recyclage</string>
    <string name="recyclage_description">Donnez une seconde vie à vos objets grâce aux tutoriels de recyclage.</string>
    <string name="recyclage_hint">Décrivez l\'objet que vous souhaitez recycler\nEx : Bouteilles en plastique, chaise en bois, ...</string>
    
    <!-- Suggestions -->
    <string name="suggestions_title">Suggestion de projets en lien avec votre projet</string>
    
    <!-- Navigation -->
    <string name="nav_creation">Création</string>
    <string name="nav_recyclage">Recyclage</string>
</resources>
```

### Exemple de Layout XML

#### fragment_creation.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/background"
    android:padding="@dimen/standard_padding">

    <!-- Header avec logo superposé -->
    <include layout="@layout/header_with_logo" />

    <!-- Navbar -->
    <include layout="@layout/navbar" />

    <!-- Contenu principal -->
    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1">
        
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="@dimen/content_height"
            android:layout_gravity="center"
            android:layout_marginStart="@dimen/standard_padding"
            android:layout_marginEnd="@dimen/standard_padding"
            android:orientation="vertical">

            <TextView
                android:id="@+id/mode_title"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="@string/creation_title"
                android:textSize="@dimen/mode_title_text_size"
                android:textStyle="bold"
                android:textColor="@color/text"
                android:gravity="center"
                android:layout_marginBottom="@dimen/standard_spacing" />

            <TextView
                android:id="@+id/mode_description"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="@string/creation_description"
                android:textSize="@dimen/description_text_size"
                android:textColor="@color/text"
                android:gravity="center"
                android:maxWidth="300dp"
                android:layout_gravity="center_horizontal"
                android:layout_marginBottom="@dimen/standard_spacing" />

            <EditText
                android:id="@+id/input_box"
                android:layout_width="match_parent"
                android:layout_height="@dimen/input_height"
                android:hint="@string/creation_hint"
                android:background="@color/white"
                android:textColor="@color/text"
                android:padding="10dp"
                android:inputType="textMultiLine"
                android:gravity="top|start"
                android:imeOptions="actionDone" />

        </LinearLayout>
    </FrameLayout>

</LinearLayout>
```

---

## 🔍 Points d'attention pour la conversion

### 1. Superposition du logo
- En Kivy : Utilisation de FloatLayout
- En Android : Utiliser ConstraintLayout ou FrameLayout avec les bonnes propriétés de positionnement

### 2. Centrage vertical du contenu
- En Kivy : AnchorLayout avec anchor_y="center"
- En Android : FrameLayout avec android:layout_gravity="center" ou ConstraintLayout

### 3. Validation de la saisie (touche Entrée)
- En Kivy : Événement `on_text_validate`
- En Android : `setOnEditorActionListener` avec `EditorInfo.IME_ACTION_DONE`

### 4. Navigation entre écrans
- En Kivy : ScreenManager avec SlideTransition
- En Android : Navigation Component avec animations personnalisées

### 5. États des boutons de navigation
- En Kivy : Changement dynamique de background_color
- En Android : StateListDrawable ou selector dans res/drawable

---

## 📊 Améliorations futures suggérées

1. **Écran de suggestions**
   - Implémenter une RecyclerView avec CardView pour afficher les suggestions
   - Ajouter des images et descriptions pour chaque projet
   - Implémenter un système de favoris

2. **Fonctionnalités additionnelles**
   - Historique des recherches
   - Partage de projets
   - Mode sombre
   - Localisation multilingue

3. **Backend**
   - API pour récupérer les suggestions de projets
   - Base de données pour stocker les tutoriels
   - Système de recommandation personnalisé

4. **UX/UI**
   - Animations de transition plus fluides
   - Feedback visuel lors de la saisie
   - Loader pendant le chargement des suggestions
   - Gestion des erreurs réseau

---

## 📞 Informations complémentaires

### Dépendances Python actuelles
```
kivy==2.3.1
```

### Prérequis Android suggérés
```gradle
dependencies {
    // Navigation
    implementation "androidx.navigation:navigation-fragment-ktx:2.7.0"
    implementation "androidx.navigation:navigation-ui-ktx:2.7.0"
    
    // Material Design
    implementation "com.google.android.material:material:1.9.0"
    
    // ConstraintLayout
    implementation "androidx.constraintlayout:constraintlayout:2.1.4"
    
    // Lifecycle
    implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1"
}
```

### Version minimale Android recommandée
- minSdkVersion : 24 (Android 7.0)
- targetSdkVersion : 34 (Android 14)
- compileSdkVersion : 34

---

**Date de création :** 11 octobre 2025  
**Version :** 1.0  
**Auteur :** Documentation générée pour conversion Python/Kivy vers Android
