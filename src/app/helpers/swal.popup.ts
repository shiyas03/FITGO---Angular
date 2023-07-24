import Swal, { SweetAlertIcon } from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export function swal(status: SweetAlertIcon, title: string) {
  Toast.fire({
    icon: status,
    title: title,
  });
}

export function swalError(error: string) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error + ', Please try again later!',
  });
}
