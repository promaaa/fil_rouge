from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import Image
from kivy.uix.behaviors import ButtonBehavior
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.screenmanager import ScreenManager, Screen, SlideTransition
from kivy.metrics import dp
from kivy.core.window import Window
from kivy.uix.anchorlayout import AnchorLayout
from kivy.graphics import Color, Rectangle

# --- Style global ---
Window.size = (360, 640)
Window.clearcolor = (0.91, 0.88, 0.84, 1)

PRIMARY_COLOR = (0.06, 0.24, 0.18, 1)
SECONDARY_COLOR = (0.75, 0.75, 0.75, 1)   
SELECTED_COLOR = (0.70, 0.8, 1, 1)
TEXT_COLOR = (0, 0, 0, 1)


# ================== ÉCRAN DE BASE ==================
class BaseScreen(Screen):
    def build_header(self, layout):
        """Logo + titres centrés"""
        header = AnchorLayout(anchor_y="top", size_hint_y=None, height=dp(150))
        header_box = BoxLayout(orientation="vertical", spacing=dp(6),
                               size_hint=(0.9, None), height=dp(140), padding=[0, dp(10), 0, 0])

        # 🖼️ logo légèrement réduit et centré
        logo = AnchorLayout(anchor_x="center")
        logo.add_widget(Image(source="logo.png", size_hint=(None, None), size=(dp(75), dp(75))))
        header_box.add_widget(logo)

        title = Label(text="[b]MAKER LENS[/b]", markup=True, font_size="21sp",
                      color=PRIMARY_COLOR, halign="center")
        subtitle = Label(text="Une nouvelle manière de percevoir les objets qui nous entourent",
                         font_size="11.5sp", color=TEXT_COLOR, halign="center")

        header_box.add_widget(title)
        header_box.add_widget(subtitle)
        header.add_widget(header_box)
        layout.add_widget(header)

    def build_navbar(self, layout, active):
        """Barre de navigation centrée"""
        nav = AnchorLayout(size_hint_y=None, height=dp(55))
        btn_box = BoxLayout(size_hint=(0.8, None), height=dp(40), spacing=dp(12))

        btn_creation = Button(
            text="Création",
            background_normal="",
            background_color=SELECTED_COLOR if active == "creation" else (0.85, 0.85, 0.85, 1),
            color=TEXT_COLOR,
            border=(20, 20, 20, 20),
            font_size="15sp"
        )
        btn_recyclage = Button(
            text="Recyclage",
            background_normal="",
            background_color=SELECTED_COLOR if active == "recyclage" else (0.85, 0.85, 0.85, 1),
            color=TEXT_COLOR,
            border=(20, 20, 20, 20),
            font_size="15sp"
        )
        btn_box.add_widget(btn_creation)
        btn_box.add_widget(btn_recyclage)
        nav.add_widget(btn_box)
        layout.add_widget(nav)
        return btn_creation, btn_recyclage


# ================== ÉCRAN CRÉATION ==================
class CreationScreen(BaseScreen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        root = BoxLayout(orientation="vertical", padding=dp(15), spacing=dp(10))
        self.build_header(root)
        btn_creation, btn_recyclage = self.build_navbar(root, "creation")

        def go_recyclage(instance):
            self.manager.current = "recyclage"
        btn_recyclage.bind(on_press=go_recyclage)

        content = AnchorLayout(anchor_y="center")
        inner = BoxLayout(orientation="vertical", spacing=dp(10), size_hint=(0.9, None))
        inner.height = dp(230)
        inner.add_widget(Label(text="[b]Mode création[/b]", markup=True, font_size="17sp",
                               color=TEXT_COLOR, halign="center"))
        inner.add_widget(Label(
            text="Trouvez des tutoriels pour fabriquer vos propres objets avec des techniques low-tech.",
            font_size="13sp", color=TEXT_COLOR, halign="center", text_size=(dp(300), None)
        ))

        self.input_box = TextInput(
            hint_text="Quel objet souhaitez-vous créer ?\nEx : Lampes, horloges, ...",
            size_hint_y=None, height=dp(100),
            background_color=(1, 1, 1, 1),
            foreground_color=(0, 0, 0, 1),
            padding=[10, 10, 10, 10],
            multiline=False
        )
        self.input_box.bind(on_text_validate=self.on_enter_pressed)

        inner.add_widget(self.input_box)
        content.add_widget(inner)
        root.add_widget(content)
        self.add_widget(root)

    def on_enter_pressed(self, instance):
        self.manager.previous_screen = "creation"
        self.manager.current = "suggestion"


# ================== ÉCRAN RECYCLAGE ==================
class RecyclageScreen(BaseScreen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        root = BoxLayout(orientation="vertical", padding=dp(15), spacing=dp(10))
        self.build_header(root)
        btn_creation, btn_recyclage = self.build_navbar(root, "recyclage")

        def go_creation(instance):
            self.manager.current = "creation"
        btn_creation.bind(on_press=go_creation)

        content = AnchorLayout(anchor_y="center")
        inner = BoxLayout(orientation="vertical", spacing=dp(10), size_hint=(0.9, None))
        inner.height = dp(230)
        inner.add_widget(Label(text="[b]Mode recyclage[/b]", markup=True, font_size="17sp",
                               color=TEXT_COLOR, halign="center"))
        inner.add_widget(Label(
            text="Donnez une seconde vie à vos objets grâce aux tutoriels de recyclage.",
            font_size="13sp", color=TEXT_COLOR, halign="center", text_size=(dp(300), None)
        ))

        self.input_box = TextInput(
            hint_text="Décrivez l’objet que vous souhaitez recycler\nEx : Bouteilles en plastique, chaise en bois, ...",
            size_hint_y=None, height=dp(100),
            background_color=(1, 1, 1, 1),
            foreground_color=(0, 0, 0, 1),
            padding=[10, 10, 10, 10],
            multiline=False
        )
        self.input_box.bind(on_text_validate=self.on_enter_pressed)

        inner.add_widget(self.input_box)
        content.add_widget(inner)
        root.add_widget(content)
        self.add_widget(root)

    def on_enter_pressed(self, instance):
        self.manager.previous_screen = "recyclage"
        self.manager.current = "suggestion"


# ================== ÉCRAN SUGGESTION ==================
class SuggestionScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        layout = BoxLayout(orientation="vertical")

        # --- Bandeau gris en haut avec bouton retour ---
        top_bar = BoxLayout(size_hint_y=None, height=dp(65), orientation="horizontal", padding=[dp(8), dp(10), dp(8), dp(10)])
        with top_bar.canvas.before:
            Color(*SECONDARY_COLOR)
            self.rect = Rectangle(pos=top_bar.pos, size=top_bar.size)
        top_bar.bind(pos=self.update_rect, size=self.update_rect)

        # Bouton flèche pour revenir à l'écran précédent (icône PNG)
        class ImageButton(ButtonBehavior, Image):
            pass

        btn_back = ImageButton(source='fleche.png', size_hint=(None, None), size=(dp(48), dp(48)))

        def go_back(instance):
            prev = getattr(self.manager, 'previous_screen', None)
            # Vérifier que prev est un nom d'écran valide
            if prev and any(s.name == prev for s in self.manager.screens):
                self.manager.current = prev
            else:
                self.manager.current = 'creation'

        btn_back.bind(on_press=go_back)

        # Titre centré (prend tout l'espace restant)
        title = Label(
            text="[b]Suggestion de projets en lien avec votre projet[/b]",
            markup=True,
            font_size="15sp",
            color=TEXT_COLOR,
            halign="center",
            size_hint_x=1
        )
        title.bind(size=title.setter('text_size'))

        top_bar.add_widget(btn_back)
        top_bar.add_widget(title)
        layout.add_widget(top_bar)

        # --- Zone vide blanche ---
        layout.add_widget(BoxLayout())
        self.add_widget(layout)

    def update_rect(self, instance, value):
        self.rect.pos = instance.pos
        self.rect.size = instance.size


# ================== APP ==================
class MakerLensApp(App):
    def build(self):
        sm = ScreenManager(transition=SlideTransition(duration=0.25))
        sm.add_widget(CreationScreen(name="creation"))
        sm.add_widget(RecyclageScreen(name="recyclage"))
        sm.add_widget(SuggestionScreen(name="suggestion"))
        sm.current = "creation"
        return sm


if __name__ == "__main__":
    MakerLensApp().run()
