const d = document;
let ClienteInput = d.querySelector(".cliente");
let ProductoInput = d.querySelector(".producto");
let PrecioInput = d.querySelector(".precio");
let ImagenInput = d.querySelector(".imagen");
let ObservacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table > tbody");
let buscarProductoInput = d.querySelector(".buscar-producto");

btnGuardar.addEventListener("click", () => {
    let datos = validarFormulario(); 
    if(datos !== null){
        guardarDatos(datos);
    }
    borrarTabla();
    mostrarDatos();
});

function validarFormulario() {
    let datosForm;
    if(ClienteInput.value == "" || ProductoInput.value == "" 
    || PrecioInput.value == "" || ImagenInput.value == "") {
        alert("Todos los campos del formulario son obligatorios");
        return;
    } else {
        datosForm = {
            cliente : ClienteInput.value,
            producto : ProductoInput.value,
            precio : PrecioInput.value,
            imagen : ImagenInput.value,
            observacion : ObservacionInput.value,
        };
    
        ClienteInput.value = "";
        ProductoInput.value = "";
        PrecioInput.value = "";
        ImagenInput.value = "";
        ObservacionInput.value = "";

        return datosForm;
    }
}

const listadoPedidos = "Pedidos";
function guardarDatos(datos) {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    pedidos.push(datos);
    localStorage.setItem(listadoPedidos,  JSON.stringify(pedidos));
    alert("Datos guardados con exito");
}

function mostrarDatos() {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    pedidos.forEach((p, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML =`
            <td> ${i + 1} </td>
            <td> ${p.cliente || ''}</td>
            <td> ${p.producto || ''}</td>
            <td> ${p.precio || ''}</td>
            <td>  <img src ="${p.imagen || ''}" width ="50%"></td>
            <td> ${p.observacion || ''}</td>
            <td>
                <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning">📄</span>
                <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">❌</span>
            <td>
        `;
        tabla.appendChild(fila);
    });
}

function borrarTabla() {
    let filas = d.querySelectorAll(".table tbody tr");
    filas.forEach((f) => {
        f.remove();
    });
}

function eliminarPedido(pos) {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    let confirmar = confirm("¿Deseas eliminar el pedido del cliente: " + (pedidos[pos]?.cliente || '') + "?");
    if(confirmar) {
        pedidos.splice(pos, 1);
        alert("Pedido Eliminado con exito");
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        borrarTabla();
        mostrarDatos();
    }
}

function actualizarPedido(pos) {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    ClienteInput.value = pedidos[pos]?.cliente || '';
    ProductoInput.value = pedidos[pos]?.producto || '';
    PrecioInput.value = pedidos[pos]?.precio || '';
    ObservacionInput.value = pedidos[pos]?.observacion || '';

    let btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");

    btnActualizar.addEventListener("click", function() {
        pedidos[pos].cliente = ClienteInput.value;
        pedidos[pos].producto = ProductoInput.value;
        pedidos[pos].precio = PrecioInput.value;
        pedidos[pos].observacion = ObservacionInput.value;
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        alert("Los datos fueron actualizados correctamente!");

        ClienteInput.value = "";
        ProductoInput.value = "";
        PrecioInput.value = "";
        ObservacionInput.value = "";

        btnActualizar.classList.toggle("d-none");
        btnGuardar.classList.toggle("d-none");

        borrarTabla();
        mostrarDatos(); 
    });
}

buscarProductoInput.addEventListener("input", () => {
    let filtro = buscarProductoInput.value.toLowerCase();
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if(pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }

    let pedidosFiltrados = pedidos.filter(p => p.producto.toLowerCase().includes(filtro));

    borrarTabla();

    pedidosFiltrados.forEach((p, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML =`
            <td> ${i + 1} </td>
            <td> ${p.cliente || ''}</td>
            <td> ${p.producto || ''}</td>
            <td> ${p.precio || ''}</td>
            <td>  <img src ="${p.imagen || ''}" width ="50%"></td>
            <td> ${p.observacion || ''}</td>
            <td>
                <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning">📄</span>
                <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">❌</span>
            <td>
        `;
        tabla.appendChild(fila);
    });
});