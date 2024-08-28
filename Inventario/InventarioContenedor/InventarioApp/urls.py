from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, ProductoViewSet, SuplidorViewSet, ClienteViewSet, VentaItemViewSet, VentaViewSet, InventarioAjusteViewSet, RegisterView, LoginView, LogoutView, UserDetailView, PasswordResetConfirmView, PasswordResetRequestView
from django.views.generic import RedirectView
from django.views.generic import RedirectView



router = DefaultRouter()
router.register(r'categoria', CategoriaViewSet),
router.register(r'producto', ProductoViewSet),
router.register(r'suplidor', SuplidorViewSet),
router.register(r'cliente', ClienteViewSet),
router.register(r'ventaitem', VentaItemViewSet),
router.register(r'venta', VentaViewSet),
router.register(r'inventario', InventarioAjusteViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('api/', include(router.urls)),
    path('', RedirectView.as_view(url='/login/', permanent=False)),
]
