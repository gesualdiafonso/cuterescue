import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

export default function SimpleRegistrationForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-300">
      <div className="bg-orange-500 p-20 py-30 rounded-2xl shadow-lg">
        <Card color="transparent" shadow={false} className="text-center">
          <Typography variant="h4" color="white">
            Cute Rescue
          </Typography>
          <Typography color="white" className="mt-1 font-normal">
            Ingresa tu mail y contraseña
          </Typography>

          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
            <div className="mb-1 flex flex-col gap-6">
              
              <Typography variant="h6" color="white" className="-mb-3 text-left">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="nombre@mail.com"
                className="custom-input"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              <Typography variant="h6" color="white" className="-mb-3 text-left">
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                className="custom-input"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>


            <Button
              className="mt-6 btn-form-login"
              fullWidth
            >
              Ingresar
            </Button>

            <Typography color="white" className="mt-4 text-center font-normal">
             
              <a href="#" className="font-medium text-gray-900">
                Me olvidaste la contraseña
              </a>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
}
