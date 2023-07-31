import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Error } from '../modules/user/services/user.interface';

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
  if(typeof error != 'string'){
    error = ''
  }
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error + ', Please try again!',
  }); 
}

export function showError(error: Error) {
  if (error.error instanceof ErrorEvent) {
    swalError(error.error.message);
    console.error('Client-side error:', error.error.message);
  } else {
    swalError(error.statusText);
    console.error('Server-side error:', error.status, error.statusText);
  }
}

export function swalConfirm(text?: string) {
  let message = text ? text : 'You can change this later!';
  return Swal.fire({
    title: 'Are you sure?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, change it!',
  });
}
