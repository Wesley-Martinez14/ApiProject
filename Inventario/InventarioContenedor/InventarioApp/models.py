from django.db import models
from django.utils import timezone
# Create your models here.

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre
    
class Suplidor(models.Model):
    nombre = models.CharField(max_length=100)
    nombre_contacto = models.CharField(max_length=100)
    numero = models.CharField(max_length=20)
    email = models.EmailField()
    direccion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    suplidor = models.ForeignKey(Suplidor, on_delete=models.CASCADE)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad_disponible = models.IntegerField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre
    
class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    email = models.EmailField()
    direccion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
class Venta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    fecha = models.DateTimeField(default=timezone.now)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cliente} - {self.fecha}"
    
class VentaItem(models.Model):
    venta = models.ForeignKey(Venta, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre}"
    
class InventarioAjuste(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    tipo_proceso = models.CharField(max_length=50, choices=[('IN', 'Entrada'), ('OUT', 'Salida')])
    cantidad = models.IntegerField()
    fecha = models.DateTimeField(default=timezone.now)
    razon = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.tipo_proceso} - {self.producto.nombre} ({self.cantidad})"