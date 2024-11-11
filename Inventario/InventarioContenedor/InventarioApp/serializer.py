from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model

from .models import Categoria, Cliente, InventarioAjuste, Producto, Suplidor, Venta, VentaItem

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class SuplidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suplidor
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    suplidor = SuplidorSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), source='categoria', write_only=True)
    suplidor_id = serializers.PrimaryKeyRelatedField(queryset=Suplidor.objects.all(), source='suplidor', write_only=True)

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'categoria', 'suplidor', 'precio', 'cantidad_disponible', 'descripcion', 'categoria_id', 'suplidor_id']


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class VentaItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all(), source='producto', write_only=True)
    venta = serializers.StringRelatedField(read_only=True)
    venta_id = serializers.PrimaryKeyRelatedField(queryset=Venta.objects.all(), source='venta', write_only=True)
    venta_fecha = serializers.DateTimeField(source='venta.fecha', format='%Y-%m-%d', read_only=True) 

    class Meta:
        model = VentaItem
        fields = ['id', 'venta', 'venta_id', 'venta_fecha', 'producto', 'producto_id', 'cantidad', 'precio']





class VentaSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), source='cliente', write_only=True)
    items = VentaItemSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'cliente_id', 'fecha', 'monto_total', 'items']


class InventarioAjusteSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all(), source='producto', write_only=True)

    class Meta:
        model = InventarioAjuste
        fields = ['id', 'producto', 'producto_id', 'tipo_proceso', 'cantidad', 'fecha', 'razon']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()



class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user is associated with this email address.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        uid = data.get('uid')
        token = data.get('token')
        new_password = data.get('new_password')

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"error": "Invalid user ID"})
        
        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError({"error": "Invalid token"})
        
        return data