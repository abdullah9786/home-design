import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useRoomStore from '../store/useRoomStore';
import { Home, Ruler, DoorOpen, SquareStack, Palette, Layers } from 'lucide-react';

const roomTypes = [
  { value: 'living-room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'dining-room', label: 'Dining Room' },
  { value: 'office', label: 'Office' },
];

const flooringTypes = [
  { value: 'wood', label: 'Hardwood' },
  { value: 'tile', label: 'Tile' },
  { value: 'carpet', label: 'Carpet' },
  { value: 'laminate', label: 'Laminate' },
  { value: 'vinyl', label: 'Vinyl' },
];

const styles = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'bohemian', label: 'Bohemian' },
];

const validationSchema = Yup.object({
  roomType: Yup.string().required('Room type is required'),
  length: Yup.number()
    .min(2, 'Length must be at least 2m')
    .max(20, 'Length must be at most 20m')
    .required('Length is required'),
  width: Yup.number()
    .min(2, 'Width must be at least 2m')
    .max(20, 'Width must be at most 20m')
    .required('Width is required'),
  height: Yup.number()
    .min(2, 'Height must be at least 2m')
    .max(6, 'Height must be at most 6m')
    .required('Height is required'),
  doors: Yup.number()
    .min(0, 'Cannot be negative')
    .max(5, 'Maximum 5 doors')
    .required('Number of doors is required'),
  windows: Yup.number()
    .min(0, 'Cannot be negative')
    .max(10, 'Maximum 10 windows')
    .required('Number of windows is required'),
  wallColor: Yup.string().required('Wall color is required'),
  flooringType: Yup.string().required('Flooring type is required'),
  style: Yup.string().required('Style preference is required'),
});

const RoomForm = () => {
  const { roomConfig, setRoomConfig, setCurrentStep } = useRoomStore();

  const handleSubmit = (values) => {
    setRoomConfig(values);
    setCurrentStep('design');
  };

  return (
    <div className="min-h-screen overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full">
          {/* Header */}
          <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            3D Home Décor Visualizer
          </h1>
          <p className="text-gray-600">
            Enter your room specifications to start designing
          </p>
        </div>

        <Formik
          initialValues={roomConfig}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Room Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <SquareStack className="inline w-4 h-4 mr-2" />
                  Room Type
                </label>
                <Field
                  as="select"
                  name="roomType"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  {roomTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="roomType"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Ruler className="inline w-4 h-4 mr-2" />
                  Room Dimensions (meters)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Length</label>
                    <Field
                      type="number"
                      name="length"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="5.0"
                    />
                    <ErrorMessage
                      name="length"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Width</label>
                    <Field
                      type="number"
                      name="width"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="4.0"
                    />
                    <ErrorMessage
                      name="width"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Height</label>
                    <Field
                      type="number"
                      name="height"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="3.0"
                    />
                    <ErrorMessage
                      name="height"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Doors and Windows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DoorOpen className="inline w-4 h-4 mr-2" />
                    Number of Doors
                  </label>
                  <Field
                    type="number"
                    name="doors"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <ErrorMessage
                    name="doors"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <SquareStack className="inline w-4 h-4 mr-2" />
                    Number of Windows
                  </label>
                  <Field
                    type="number"
                    name="windows"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <ErrorMessage
                    name="windows"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Wall Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Palette className="inline w-4 h-4 mr-2" />
                  Wall Color
                </label>
                <div className="flex items-center gap-4">
                  <Field
                    type="color"
                    name="wallColor"
                    className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <span className="text-sm text-gray-600 font-mono">{values.wallColor}</span>
                </div>
                <ErrorMessage
                  name="wallColor"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Flooring Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Layers className="inline w-4 h-4 mr-2" />
                  Flooring Type
                </label>
                <Field
                  as="select"
                  name="flooringType"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  {flooringTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="flooringType"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Style Preference */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Style Preference
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {styles.map((style) => (
                    <label
                      key={style.value}
                      className={`
                        flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition
                        ${
                          values.style === style.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300'
                        }
                      `}
                    >
                      <Field
                        type="radio"
                        name="style"
                        value={style.value}
                        className="hidden"
                      />
                      {style.label}
                    </label>
                  ))}
                </div>
                <ErrorMessage
                  name="style"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Start Designing in 3D →
              </button>
            </Form>
          )}
        </Formik>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;

