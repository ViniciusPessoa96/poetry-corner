
lista = [n for n in range(0, 100)]

listaPaginada = []

a,b = 0,10

i = (len(lista) // 9)

for n in range(0, i):
    listaPaginada.append(lista[a:b])
    a = a + 9
    b = b + 9

