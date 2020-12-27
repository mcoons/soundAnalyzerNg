
import { Injectable, Inject } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'prod'; // dev or prod

  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;



  // RibbonSPSs =
  //   [
  //     'blockPlaneRibbon',
  //     'thing1Ribbon',
  //     'blockSpiralRibbon',
  //     'thing2Ribbon',
  //     'equationRibbon',
  //     'thing3Ribbon',
  //     'cubeRibbon',
  //     'sphereRibbon',
  //     'poleRibbon',
  //     'heartRibbon',
  //     'sineLoopRibbon'
  //   ];

  notes = [
    'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'None'
  ];


  ///////////////////////////////////////////////
  // NEW BASE OPTIONS

  newBaseOptions = {
    version: 'b_1.0',

    currentVisual: 0,

    general: {
      showTitle: true,
      showWaveform: false,
      showSoundWave: false,
      showAxis: false,

      showBars:
      {
        value: false,

        currentNote: 12,   //  Internal only - no display

        // key highlight options
        // an array of objects to render using the array keyname as group dropdown name
        note: [
          // A:
          {
            label: 'A',
            value: 82,
            checked: false,

            hertz: 55,
          },
          // 'A#':
          {
            label: 'A#',
            value: 87,
            checked: false,

            hertz: 58.270,
          },
          // B:
          {
            label: 'B',
            value: 92,
            checked: false,

            hertz: 61.735,
          },

          // C:
          {
            label: 'C',
            value: 33,
            checked: false,

            hertz: 32.703,
          },
          // 'C#':
          {
            label: 'C#',
            value: 39,
            checked: false,

            hertz: 34.648,
          },
          // D:
          {
            label: 'D',
            value: 45,
            checked: false,

            hertz: 36.708,
          },
          // 'D#':
          {
            label: 'D#',
            value: 52,
            checked: false,

            hertz: 38.891,
          },
          // E:
          {
            label: 'E',
            value: 58,
            checked: false,

            hertz: 41.2035,
          },
          // F:
          {
            label: 'F',
            value: 65,
            checked: false,

            hertz: 43.654,
          },
          // 'F#':
          {
            label: 'F#',
            value: 69,
            checked: false,

            hertz: 46.249,
          },
          // G:
          {
            label: 'G',
            value: 73,
            checked: false,

            hertz: 48.999,
          },
          // 'G#':
          {
            label: 'G#',
            value: 77,
            checked: false,

            hertz: 51.913,
          },
          // None:
          {
            label: 'None',
            value: 0,
            checked: true,

            hertz: 0,
          }

        ],
      }

    },

    visual: [
      // singleSPSCube:
      {
        // type: 'radio',
        label: 'Morphing Cubes',
        value: 0,
        checked: true,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .01,
        cradius: 1200,

        // material: {
        //   diffuseColor: '#ffffff',
        //   specularColor: '#ffffff',
        //   emissiveColor: '#ffffff',
        //   ambientColor: '#ffffff'
        // },

        scene: {
          backgroundColor: '#000000',
          glow: false,
          glowIntensity: 0,
        },

        camera: {
          filter_parameters: {
            chromatic_aberration: 0.0,  //1.0,
            edge_blur: 0, // 1.0,
            distortion: .5, // 1.0,
            grain_amount: 0.5,
            dof_focus_distance: 100,  // 2000,
            dof_aperture: 10, // 1,
            dof_darken: .1, // 0,
            dof_pentagon: true,
            dof_gain: 1,
            dof_threshold: 1,
            blur_noise: true
          }
        },

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 7,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 131,
          },

          color: [
            {
              label: 'Maximum Color',
              value: '#ff0000'
            },
            {
              label: 'Middle Color',
              value: '#fff700'
            },
            {
              label: 'Minimum Color',
              value: '#000000'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 30,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 25,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 5,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#e1ff00'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 200,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ff0000'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],

        singleSPSDelay: {
          label: 'Change Delay (sec)',
          value: 5,
        },

        singleSPSExplosionSize: {
          label: 'Explosion Size',
          value: 0,
        },

        types: [

          // blockPlane:
          {
            label: 'Cube Block Plane',
            value: true,
            function: 'blockPlane'
          },
          // thing1:
          {
            label: 'Cube Thing 1',
            value: true,
            function: 'thing1'
          },
          // blockSpiral:
          {
            label: 'Cube Block Spiral',
            value: true,
            function: 'blockSpiral'
          },
          // thing2:
          {
            label: 'Cube Thing 2',
            value: true,
            function: 'thing2'
          },
          // equation:
          {
            label: 'Cube Equation',
            value: false,
            function: 'equation'
          },
          // thing3:
          {
            label: 'Cube Thing 3',
            value: false,
            function: 'thing3'
          },
          // cube:
          {
            label: 'Cube Cube',
            value: true,
            function: 'cube'
          },
          // sphere:
          {
            label: 'Cube Sphere',
            value: true,
            function: 'sphere'
          },
          // pole:
          {
            label: 'Cube Pole',
            value: false,
            function: 'pole'
          },
          // heart:
          {
            label: 'Cube Heart',
            value: true,
            function: 'heart'
          },
          // sineLoop2:
          {
            label: 'Cube Sine Loop',
            value: true,
            function: 'sineLoop2'
          }

        ]
      },

      // starManager:
      {
        // type: 'radio',
        label: 'Stars',
        value: 1,
        checked: false,

        colorOptions: false,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .01,
        cradius: 737,

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 6,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 128,
          },

          color: [

            // maxColor:
            {
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 30,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 25,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 5,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ]
      },

      // spectrograph:
      {
        label: 'Spectrograph',
        value: 2,
        checked: false,

        colorOptions: false,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .72,
        cradius: 1200,

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 6,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 128,
          },

          color: [

            // maxColor:
            {
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              label: 'Middle Color',
              value: '#000000'
            },
            // minColor:
            {
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 100,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 25,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 5,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],
      },

      // spherePlaneManagerSPS:
      {
        label: 'Sphere Plane',
        value: 3,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: 1.01,
        cradius: 1700,

        autoRotate: {
          label: 'Auto Camera Movement',
          value: false,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 6,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 128,
          },

          color: [

            // maxColor:
            {
              label: 'Maximum Color',
              value: '#ffffff'
            },
            // midColor:
            {
              label: 'Middle Color',
              value: '#8f8f8f'
            },
            // minColor:
            {
              label: 'Minimum Color',
              value: '#397f5d'
            },

          ],
        },
        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 35,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#420000'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 15,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#0f5601'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 10,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#010ecb'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 15,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: -50,
            },
            color: {
              label: 'Left Color',
              value: '#ff0000'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#0008ff'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: -50,
            },
            color: {
              label: 'Bottom Color',
              value: '#00ff1e'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#ff0000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: -50,
            },
            color: {
              label: 'Rear Color',
              value: '#0400ff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#00ff11'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 200,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#1f1f1f'
            },
          }

        ],
      },

      // spherePlaneManager2SPS:
      {
        label: 'Sphere Plane 2',
        value: 4,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        // cbeta: .01,
        cbeta: Math.PI/2,
        cradius: 2420,

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 8,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 128,
          },

          color: [

            // maxColor:
            {
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              label: 'Middle Color',
              value: '#00ff00'
            },
            // minColor:
            {
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 30,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 25,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 5,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],
      },

      // rings:
      {
        label: 'Rings',
        value: 5,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .72,
        cradius: 2645,

        autoRotate: {
          label: 'Auto Camera Movement',
          value: false,

          cameraCustom: false
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 8,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 128,
          },

          color: [

            // maxColor:
            {
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              label: 'Middle Color',
              value: '#00ff00'
            },
            // minColor:
            {
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 30,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 25,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 5,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],
      },

      // dancingRainbow:
      {
        // type: 'radio',
        label: 'Dancing Rainbow',
        value: 6,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .01,
        cradius: 7625,

        material: {
          diffuseColor: '#ffffff',
          specularColor: '#ffffff',
          emissiveColor: '#ffffff',
          ambientColor: '#ffffff'
        },

        scene: {
          glow: false,
          glowIntensity: 0,
        },

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 6,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 150,
          },

          color: [
            {
              label: 'Maximum Color',
              value: '#ffffff'
            },
            {
              label: 'Middle Color',
              value: '#a3a3a3'
            },
            {
              label: 'Minimum Color',
              value: '#000000'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#d10000'
            },
            specular: {
              label: 'Right Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#00ffff'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 40,
            },
            color: {
              label: 'Top Color',
              value: '#00ff2a'
            },
            specular: {
              label: 'Top Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#ff00ff'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 40,
            },
            color: {
              label: 'Front Color',
              value: '#1100ff'
            },
            specular: {
              label: 'Front Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#ffff00'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ff00ff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffff00'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#00ffee'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 10,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],

      },


      // morph:
      {
        // type: 'radio',
        label: 'Morph',
        value: 7,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: 2.1,
        cradius: 1900,

        material: {
          diffuseColor: '#ffffff',
          specularColor: '#ffffff',
          emissiveColor: '#ffffff',
          ambientColor: '#ffffff'
        },

        scene: {
          glow: false,
          glowIntensity: 0,
        },

        autoRotate: {
          label: 'Auto Camera Movement',
          value: false,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 6,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 150,
          },

          color: [
            {
              label: 'Maximum Color',
              value: '#ffffff'
            },
            {
              label: 'Middle Color',
              value: '#a3a3a3'
            },
            {
              label: 'Minimum Color',
              value: '#000000'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 50,
            },
            color: {
              label: 'Right Color',
              value: '#d10000'
            },
            specular: {
              label: 'Right Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#00ffff'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 50,
            },
            color: {
              label: 'Top Color',
              value: '#00ff2a'
            },
            specular: {
              label: 'Top Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#ff00ff'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 50,
            },
            color: {
              label: 'Front Color',
              value: '#1100ff'
            },
            specular: {
              label: 'Front Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#ffff00'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: -45,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ff00ff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffff00'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#00ffee'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 10,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#ffffff'
            },
          }

        ],

      },

      // hex:
      {
        label: 'Hex',
        value: 8,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: 1.08,
        cradius: 1600,

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 8,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 118,
          },

          color: [

            // maxColor:
            {
              label: 'Maximum Color',
              value: '#ff1414'
            },
            // midColor:
            {
              label: 'Middle Color',
              value: '#0084d6'
            },
            // minColor:
            {
              label: 'Minimum Color',
              value: '#a3a3a3'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 60,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 40,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 20,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 200,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],
      },

      // notes:
      {
        label: 'Notes (Under Development)',
        value: 9,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: 1.45,
        cradius: 1200,

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 8,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 128,
          },

          color: [

            // maxColor:
            {
              label: 'Maximum Color',
              value: '#ff0000'
            },
            // midColor:
            {
              label: 'Middle Color',
              value: '#00ff00'
            },
            // minColor:
            {
              label: 'Minimum Color',
              value: '#0000ff'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Right Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 30,
            },
            color: {
              label: 'Top Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Top Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 25,
            },
            color: {
              label: 'Front Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Front Specular',
              value: '#454545'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#000000'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 5,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],
      },

      // singleSPSTriangle:
      {
        // type: 'radio',
        label: 'Triangles (Under Development)',
        value: 10,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .97,
        cradius: 1725,

        material: {
          diffuseColor: '#ffffff',
          specularColor: '#ffffff',
          emissiveColor: '#ffffff',
          ambientColor: '#ffffff'
        },

        scene: {
          glow: false,
          glowIntensity: 0,
        },

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 8,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 150,
          },

          color: [
            {
              label: 'Maximum Color',
              value: '#ffffff'
            },
            {
              label: 'Middle Color',
              value: '#a3a3a3'
            },
            {
              label: 'Minimum Color',
              value: '#000000'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#d10000'
            },
            specular: {
              label: 'Right Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#00ffff'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 40,
            },
            color: {
              label: 'Top Color',
              value: '#00ff2a'
            },
            specular: {
              label: 'Top Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#ff00ff'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 40,
            },
            color: {
              label: 'Front Color',
              value: '#1100ff'
            },
            specular: {
              label: 'Front Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#ffff00'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ff00ff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffff00'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#00ffee'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 10,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],

      },





      // lights:
      {
        // type: 'radio',
        label: 'Lights (Under Development)',
        value: 11,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: Math.PI/2,
        cradius: 445,

        material: {
          diffuseColor: '#ffffff',
          specularColor: '#ffffff',
          emissiveColor: '#ffffff',
          ambientColor: '#ffffff'
        },

        scene: {
          glow: false,
          glowIntensity: 0,
        },

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 6,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 150,
          },

          color: [
            {
              label: 'Maximum Color',
              value: '#ffffff'
            },
            {
              label: 'Middle Color',
              value: '#a3a3a3'
            },
            {
              label: 'Minimum Color',
              value: '#000000'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#d10000'
            },
            specular: {
              label: 'Right Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#00ffff'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 40,
            },
            color: {
              label: 'Top Color',
              value: '#00ff2a'
            },
            specular: {
              label: 'Top Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#ff00ff'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 40,
            },
            color: {
              label: 'Front Color',
              value: '#1100ff'
            },
            specular: {
              label: 'Front Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#ffff00'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ff00ff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffff00'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#00ffee'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 10,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],

      },


      // mirrors:
      {
        // type: 'radio',
        label: 'Mirrors (Under Development)',
        value: 12,
        checked: false,

        colorOptions: true,
        cameraOptions: false,

        calpha: 4.72,
        cbeta: .01,
        cradius: 1200,

        material: {
          diffuseColor: '#ffffff',
          specularColor: '#ffffff',
          emissiveColor: '#ffffff',
          ambientColor: '#ffffff'
        },

        scene: {
          glow: false,
          glowIntensity: 0,
        },

        autoRotate: {
          label: 'Auto Camera Movement',
          value: true,

          cameraCustom: true
        },

        sampleGain: {
          label: 'Visual Effect Strength',
          value: 1,
        },

        smoothingConstant: {
          label: 'Smoothing Constant',
          value: 8,
        },

        customColors: {
          label: 'Custom Colors',
          value: true,

          midLoc: {
            label: 'Midpoint Value',
            value: 150,
          },

          color: [
            {
              label: 'Maximum Color',
              value: '#ffffff'
            },
            {
              label: 'Middle Color',
              value: '#a3a3a3'
            },
            {
              label: 'Minimum Color',
              value: '#000000'
            },

          ],
        },

        light: [  //  array of lights

          {
            intensity: {
              label: 'Right Intensity',
              value: 40,
            },
            color: {
              label: 'Right Color',
              value: '#d10000'
            },
            specular: {
              label: 'Right Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Right Back Color',
              value: '#00ffff'
            },
          },

          {
            intensity: {
              label: 'Top Intensity',
              value: 40,
            },
            color: {
              label: 'Top Color',
              value: '#00ff2a'
            },
            specular: {
              label: 'Top Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Top Back Color',
              value: '#ff00ff'
            },
          },

          {
            intensity: {
              label: 'Front Intensity',
              value: 40,
            },
            color: {
              label: 'Front Color',
              value: '#1100ff'
            },
            specular: {
              label: 'Front Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Front Back Color',
              value: '#ffff00'
            }
          },

          {
            intensity: {
              label: 'Camera Intensity',
              value: 0,
            },
            color: {
              label: 'Camera Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Left Intensity',
              value: 0,
            },
            color: {
              label: 'Left Color',
              value: '#ff00ff'
            },
            specular: {
              label: 'Left Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Left Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Bottom Intensity',
              value: 0,
            },
            color: {
              label: 'Bottom Color',
              value: '#ffff00'
            },
            specular: {
              label: 'Bottom Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Bottom Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Rear Intensity',
              value: 0,
            },
            color: {
              label: 'Rear Color',
              value: '#00ffee'
            },
            specular: {
              label: 'Rear Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Rear Back Color',
              value: '#000000'
            },
          },

          {
            intensity: {
              label: 'Camera Rimlight Intensity',
              value: 10,
            },
            color: {
              label: 'Camera Rimlight Color',
              value: '#ffffff'
            },
            specular: {
              label: 'Camera Rimlight Specular',
              value: '#000000'
            },
            groundColor: {
              label: 'Camera Rimlight Back Color',
              value: '#000000'
            },
          }

        ],

      },

    ]

  };

  public visuals = [
    'singleSPSCube',
    'starManager',
    'spectrograph',
    'spherePlaneManagerSPS',
    'spherePlaneManager2SPS',
    'rings',
    'dancingRainbow',
    'Morph',
    'hex',
    'notes',
    'singleSPSTriangle',
    'Lights',
    'Mirrors'
  ];

  public CubeSPSs = [];

  public favorites = [];

  ///////////////////////////////////////////////
  // ORIGINAL BASE OPTIONS
  // baseOptions = {

  //   version: 3.88,

  //   // general options
  //   showTitle: {
  //     group: 'General',
  //     type: 'checkbox',
  //     label: 'Show Title',
  //     value: true,
  //   },
  //   showBars: {
  //     group: 'General',
  //     type: 'checkbox',
  //     label: 'Show Freq Bars',
  //     value: false
  //   },
  //   showWaveform: {
  //     group: 'General',
  //     type: 'checkbox',
  //     label: 'Show Waveform',
  //     value: false
  //   },
  //   waveformMultiplier: {
  //     group: 'General',
  //     type: 'waveslider',
  //     label: 'Waveform Multiplier',
  //     value: 1,
  //     min: 1,
  //     max: 10,
  //     step: .1
  //   },



  //   // front light
  //   light0Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Front Intensity',
  //     value: 80,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light0Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light0Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },
  //   light0GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },

  //   // rear light
  //   light1Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Rear Intensity',
  //     value: 30,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light1Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light1Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },
  //   light1GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },

  //   // left light
  //   light2Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Left Intensity',
  //     value: 10,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light2Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light2Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },

  //   light2GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },

  //   // right light
  //   light3Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Right Intensity',
  //     value: 5,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light3Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light3Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },
  //   light3GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },

  //   // top light
  //   light4Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Top Intensity',
  //     value: 5,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light4Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light4Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },
  //   light4GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },



  //   // bottom light
  //   light5Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Bottom Intensity',
  //     value: 5,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light5Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light5Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },
  //   light5GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },


  //   // camera light
  //   light6Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Camera Intensity',
  //     value: 5,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light6Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light6Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },
  //   light6GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },



  //   // camera rimlight
  //   light7Intensity: {
  //     group: 'Scene',
  //     type: 'slider',
  //     label: 'Camera Rimlight Intensity',
  //     value: 5,
  //     min: -200,
  //     max: 200,
  //     step: 5,
  //     visualCustom: true
  //   },
  //   light7Color: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Color',
  //     value: '#ffffff',
  //     visualCustom: true
  //   },
  //   light7Specular: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Specular',
  //     value: '#454545',
  //     visualCustom: true
  //   },
  //   light7GroundColor: {
  //     group: 'Scene',
  //     type: 'color',
  //     label: 'Back Color',
  //     value: '#454545',
  //     visualCustom: true
  //   },










  //   starManager: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Stars',
  //     value: 1,
  //     checked: false,
  //     colorOptions: false,
  //     cameraOptions: false,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: false,
  //     customColors: false,
  //     minColor: '#0000ff',
  //     midColor: '#00ff00',
  //     maxColor: '#ff0000',
  //     midLoc: 128,
  //     calpha: 4.72,
  //     cbeta: .01,
  //     cradius: 1200,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },
  //   spectrograph: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Spectrograph',
  //     value: 2,
  //     checked: false,
  //     colorOptions: false,
  //     cameraOptions: false,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: false,
  //     customColors: false,
  //     minColor: '#0000ff',
  //     midColor: '#00ff00',
  //     maxColor: '#ff0000',
  //     midLoc: 128,
  //     calpha: 4.72,
  //     cbeta: .85,
  //     cradius: 1200,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },

  //   spherePlaneManagerSPS: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Sphere Plane',
  //     value: 3,
  //     checked: false,
  //     colorOptions: true,
  //     cameraOptions: true,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: true,
  //     customColors: false,
  //     minColor: '#ff0000',
  //     midColor: '#2b00ff',
  //     maxColor: '#42fffc',
  //     midLoc: 145,
  //     calpha: 4.72,
  //     cbeta: .81,
  //     cradius: 1200,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },

  //   spherePlaneManager2SPS: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Sphere Plane 2',
  //     value: 4,
  //     checked: false,
  //     colorOptions: true,
  //     cameraOptions: true,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: false,
  //     customColors: false,
  //     minColor: '#000000',
  //     midColor: '#2760aa',
  //     maxColor: '#ff0505',
  //     midLoc: 110,
  //     calpha: 4.72,
  //     cbeta: .01,
  //     cradius: 3200,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },



  //   rings: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Rings',
  //     value: 5,
  //     checked: false,
  //     colorOptions: true,
  //     cameraOptions: false,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: false,
  //     customColors: false,
  //     minColor: '#0000ff',
  //     midColor: '#00ff00',
  //     maxColor: '#ff0000',
  //     midLoc: 128,
  //     calpha: 4.72,
  //     cbeta: .81,
  //     cradius: 1200,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },
  //   hex: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Hex',
  //     value: 6,
  //     checked: false,
  //     colorOptions: true,
  //     cameraOptions: true,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: true,
  //     customColors: false,
  //     minColor: '#0000ff',
  //     midColor: '#00ff00',
  //     maxColor: '#ff0000',
  //     midLoc: 128,
  //     calpha: 4.72,
  //     cbeta: .91,
  //     cradius: 1200,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },
  //   notes: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Notes',
  //     value: 7,
  //     checked: false,
  //     colorOptions: true,
  //     cameraOptions: false,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: false,
  //     customColors: true,
  //     minColor: '#0000ff',
  //     midColor: '#00ff00',
  //     maxColor: '#ff0000',
  //     midLoc: 128,
  //     calpha: 4.72,
  //     cbeta: .85,
  //     cradius: 1200,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },

  //   singleSPSCube: {
  //     group: '3DVisual',
  //     type: 'radio',
  //     label: 'Exploding Cube SPS',
  //     value: 0,
  //     checked: true,
  //     colorOptions: true,
  //     cameraOptions: true,
  //     sampleGain: 1,
  //     smoothingConstant: 8,
  //     autoRotate: true,
  //     customColors: false,
  //     minColor: '#0000ff',
  //     midColor: '#00ff00',
  //     maxColor: '#ff0000',
  //     midLoc: 128,
  //     calpha: 0.72,
  //     cbeta: 1.57,
  //     cradius: 1000,
  //     light0Intensity: 80,
  //     light0Color: '#ffffff',
  //     light0Specular: '#454545',
  //     light0GroundColor: '#454545',
  //     light1Intensity: 30,
  //     light1Color: '#ffffff',
  //     light1Specular: '#454545',
  //     light1GroundColor: '#454545',
  //     light2Intensity: 10,
  //     light2Color: '#ffffff',
  //     light2Specular: '#454545',
  //     light2GroundColor: '#454545',
  //     light3Intensity: 5,
  //     light3Color: '#ffffff',
  //     light3Specular: '#454545',
  //     light3GroundColor: '#454545',
  //     light4Intensity: 5,
  //     light4Color: '#ffffff',
  //     light4Specular: '#454545',
  //     light4GroundColor: '#454545',
  //     light5Intensity: 5,
  //     light5Color: '#ffffff',
  //     light5Specular: '#454545',
  //     light5GroundColor: '#454545',
  //     light6Intensity: 5,
  //     light6Color: '#ffffff',
  //     light6Specular: '#454545',
  //     light6GroundColor: '#454545',
  //     light7Intensity: 5,
  //     light7Color: '#ffffff',
  //     light7Specular: '#454545',
  //     light7GroundColor: '#454545',
  //   },

  //   singleSPSDelay: {
  //     group: '3DVisual',
  //     type: 'slider',
  //     label: 'Change Delay (sec)',
  //     value: 10,
  //     min: 5,
  //     max: 60,
  //     step: 5,
  //   },
  //   singleSPSExplosionSize: {
  //     group: '3DVisual',
  //     type: 'slider',
  //     label: 'Explosion Size',
  //     value: 0,
  //     min: 0,
  //     max: 150,
  //     step: 10,
  //   },




  //   blockPlane: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Block Plane',
  //     value: true,
  //   },
  //   thing1: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Thing 1',
  //     value: true,
  //   },
  //   blockSpiral: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Block Spiral',
  //     value: true,
  //   },
  //   thing2: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Thing 2',
  //     value: true,
  //   },
  //   equation: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Equation',
  //     value: true,
  //   },
  //   thing3: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Thing 3',
  //     value: true,
  //   },
  //   cube: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Cube',
  //     value: true,
  //   },
  //   sphere: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Sphere',
  //     value: true,
  //   },
  //   pole: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Pole',
  //     value: true,
  //   },

  //   heart: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Heart',
  //     value: true,
  //   },

  //   // sineLoop: {
  //   //   group: 'CubeSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Cube Sine Loop',
  //   //   value: true,
  //   // },


  //   sineLoop2: {
  //     group: 'CubeSPS',
  //     type: 'checkbox',
  //     label: 'Cube Sine Loop',
  //     value: true,
  //   },



  //   sampleGain: {
  //     group: 'VisualEffect',
  //     type: 'slider',
  //     label: 'Visual Effect Strength',
  //     value: 1,
  //     min: 1,
  //     max: 10,
  //     step: 1,
  //     visualCustom: true
  //   },
  //   smoothingConstant: {
  //     group: 'VisualEffect',
  //     type: 'slider',
  //     label: 'Smoothing Constant',
  //     value: 8,
  //     min: 1,
  //     max: 9.9,
  //     step: .1,
  //     visualCustom: true
  //   },
  //   autoRotate: {
  //     group: 'VisualEffect',
  //     type: 'checkbox',
  //     label: 'Auto Rotate',
  //     value: true,
  //     cameraCustom: true
  //   },

  //   customColors: {
  //     group: 'VisualEffect',
  //     type: 'checkbox',
  //     label: 'Custom Colors',
  //     value: true,
  //     visualCustom: true
  //   },
  //   maxColor: {
  //     group: 'VisualEffect',
  //     type: 'color',
  //     label: 'Maximum Color',
  //     value: '#ff0000',
  //     visualCustom: true
  //   },
  //   midColor: {
  //     group: 'VisualEffect',
  //     type: 'color',
  //     label: 'Middle Color',
  //     value: '#000000',
  //     visualCustom: true
  //   },
  //   minColor: {
  //     group: 'VisualEffect',
  //     type: 'color',
  //     label: 'Minimum Color',
  //     value: '#0000ff',
  //     visualCustom: true
  //   },
  //   midLoc: {
  //     group: 'VisualEffect',
  //     type: 'colorslider',
  //     label: 'Midpoint Value',
  //     value: 128,
  //     min: 20,
  //     max: 235,
  //     step: 5,
  //     visualCustom: true
  //   },



  //   // singleSPSRibbon: {
  //   //   group: '3DVisual',
  //   //   type: 'radio',
  //   //   label: 'Exploding Ribbon SPS',
  //   //   value: 1,
  //   //   checked: true,
  //   //   colorOptions: true,
  //   //   cameraOptions: true,
  //   //   sampleGain: 1,
  //   //   smoothingConstant: 8,
  //   //   autoRotate: true,
  //   //   customColors: false,
  //   //   minColor: '#0000ff',
  //   //   midColor: '#00ff00',
  //   //   maxColor: '#ff0000',
  //   //   midLoc: 128,
  //   //   calpha: 4.72,
  //   //   cbeta: 1.57,
  //   //   cradius: 1000,
  //   //   light0Intensity: 80,
  //   //   light0Color: '#ffffff',
  //   //   light0Specular: '#454545',
  //   //   light1Intensity: 30,
  //   //   light1Color: '#ffffff',
  //   //   light1Specular: '#454545',
  //   //   light2Intensity: 10,
  //   //   light2Color: '#ffffff',
  //   //   light2Specular: '#454545',
  //   //   light3Intensity: 5,
  //   //   light3Color: '#ffffff',
  //   //   light3Specular: '#454545',
  //   // },

  //   // blockPlaneRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Block Plane',
  //   //   value: true,
  //   // },
  //   // thing1Ribbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Thing 1',
  //   //   value: true,
  //   // },
  //   // blockSpiralRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Block Spiral',
  //   //   value: true,
  //   // },
  //   // thing2Ribbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Thing 2',
  //   //   value: true,
  //   // },
  //   // equationRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Equation',
  //   //   value: true,
  //   // },
  //   // thing3Ribbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Thing 3',
  //   //   value: true,
  //   // },
  //   // cubeRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Cube',
  //   //   value: true,
  //   // },
  //   // sphereRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Sphere',
  //   //   value: true,
  //   // },
  //   // poleRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Pole',
  //   //   value: true,
  //   // },

  //   // heartRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Heart',
  //   //   value: true,
  //   // },

  //   // sineLoopRibbon: {
  //   //   group: 'RibbonSPS',
  //   //   type: 'checkbox',
  //   //   label: 'Sine Loop',
  //   //   value: true,
  //   // },










  //   // key highlight options
  //   currentNote: {
  //     group: 'Hidden',
  //     type: 'string',
  //     label: 'currentNote',
  //     value: 'None'
  //   },
  //   None: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'None',
  //     hertz: 0,
  //     value: 0,
  //     checked: true
  //   },
  //   C: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'C',
  //     hertz: 32.703,
  //     value: 33,
  //     checked: false
  //   },
  //   'C#': {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'C#',
  //     hertz: 34.648,
  //     value: 39,
  //     checked: false
  //   },
  //   D: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'D',
  //     hertz: 36.708,
  //     value: 45,
  //     checked: false
  //   },
  //   'D#': {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'D#',
  //     hertz: 38.891,
  //     value: 52,
  //     checked: false
  //   },
  //   E: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'E',
  //     hertz: 41.2035,
  //     value: 58,
  //     checked: false
  //   },
  //   F: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'F',
  //     hertz: 43.654,
  //     value: 65,
  //     checked: false
  //   },
  //   'F#': {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'F#',
  //     hertz: 46.249,
  //     value: 69,
  //     checked: false
  //   },
  //   G: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'G',
  //     hertz: 48.999,
  //     value: 73,
  //     checked: false
  //   },
  //   'G#': {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'G#',
  //     hertz: 51.913,
  //     value: 77,
  //     checked: false
  //   },
  //   A: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'A',
  //     hertz: 55,
  //     value: 82,
  //     checked: false
  //   },
  //   'A#': {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'A#',
  //     hertz: 58.270,
  //     value: 87,
  //     checked: false
  //   },
  //   B: {
  //     group: 'KeyHighlight',
  //     type: 'numeric',
  //     label: 'B',
  //     hertz: 61.735,
  //     value: 92,
  //     checked: false
  //   },

  // };


  ///////////////////////////////////////////////


  // options = JSON.parse(JSON.stringify(this.baseOptions));

  public state = {
    showPanel: { value: false },
    showFavorites: { value: false },
    showPlayer: { value: false },
    showSplash: { value: true },
    currentVisual: { value: 0 },
    windowHeight: { value: 0 },
    playerHeight: { value: 0 },
    pixelRatio: { value: 0 },
    playerTopHTML: { value: 0 },
    playerTopCanvas: { value: 0 },
    playlist: { value: [] },
    currentTrack: { value: 0 },
    playing: { value: false },
    microphone: { value: false },
    renderPlayer: { value: false },
    showTrackTitle: { value: true },
    input: { value: 'site' },

    volume: {
      group: 'Hidden',
      type: 'slider',
      label: 'Volume',
      min: 0,
      max: 10,
      step: 1,
      value: 5
    }
  };

  constructor(
    @Inject(MessageService) public messageService: MessageService,
    @Inject(StorageService) public storageService: StorageService
  ) {
    console.log('Options Service Constructor');
    // sData.map( element => element.toUpperCase() );
    // console.log(this.newBaseOptions.visual.map( element => element.label ));

    this.CubeSPSs = this.newBaseOptions.visual[0].types.map(element => element.function);

    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      this.windowResize();
    });

    // const lOptions = storageService.loadOptions();
    // if (lOptions.version) {
    //   if (lOptions.version !== this.baseOptions.version) {
    //     storageService.deleteOptions();
    //     alert('Options have changed.  Clearing saved settings.');
    //   } else {
    //     // load user options
    //     for (const [key, value] of Object.entries(lOptions)) {
    //       if (key in this.baseOptions) {
    //         // console.log(`${key}: ${value}`);
    //         if (typeof value === 'object' && value !== null) {

    //           for (const [ikey, ivalue] of Object.entries(value)) {
    //             this.options[key][ikey] = ivalue;
    //           }

    //         } else {
    //           this.options[key] = value;
    //         }
    //       }
    //     }
    //     this.updateCustomOptions(this.state.currentVisual.value);
    //   }
    // } else {
    //   console.log('local options error');
    // }

    // console.log('Options');
    // console.log(this.options);


    const lFavorites = storageService.loadFavorites();
    // console.log(lFavorites);
    if (lFavorites.error === 'local storage error') {
      this.favorites = [];
      console.log('leaving favs as', lFavorites);
    } else {
      console.log('favs found in lFavorites');

      this.favorites = lFavorites;



      // load user options
      for (const [key, value] of Object.entries(lFavorites)) {
        if (key in this.newBaseOptions) {
          // console.log(`${key}: ${value}`);
          if (typeof value === 'object' && value !== null) {

            for (const [ikey, ivalue] of Object.entries(value)) {


              if (typeof ivalue === 'object' && ivalue !== null) {

                for (const [iikey, iivalue] of Object.entries(ivalue)) {


                  if (typeof iivalue === 'object' && iivalue !== null) {


                    for (const [iiikey, iiivalue] of Object.entries(iivalue)) {

                      this.newBaseOptions[key][ikey][iikey][iiikey] = iiivalue;
                    }

                  } else {
                    this.newBaseOptions[key][ikey][iikey] = iivalue;
                  }


                }
              } else {
                this.newBaseOptions[key][ikey] = ivalue;
              }

            }

          } else {
            this.newBaseOptions[key] = value;
          }
        }
      }





      this.updateCustomOptions(this.favorites.length - 1);

    }

  }

  // toggleFavoritesRadio(itemName: string, index: number) {
  //   this.favorites.forEach((f, i) => {
  //     f.checked = (itemName === f.label);
  //   });
  // }

  toggleNoteRadioNew(itemName: string, index: number) {
    this.notes.forEach((n, i) => {
      this.newBaseOptions.general.showBars.note[i].checked = (itemName === n);
    });
    this.newBaseOptions.general.showBars.currentNote = index;
  }


  toggleState(itemName: string) {
    this.state[itemName].value = !this.state[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.state[itemName].value);
  }

  updateCustomOptions(visualIndex) {

    setTimeout(() => {

      this.messageService.announceMessage('set lights');
      this.messageService.announceMessage('set camera');

      this.announceChange('smoothingConstant');
      this.announceChange('sampleGain');

    }, .05);

  }

  toggleNoteRadio(itemName: string, index: number) {
    // this.notes.forEach(n => {
    //   this.options[n].checked = (itemName === n);
    // });
    // this.storageService.saveOptions(this.options);
  }

  setOption(itemName: string, value) {
    // this.options[itemName].value = value;
    this.windowResize();
    // this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
    // this.storageService.saveOptions(this.options);
  }

  updateState(itemName: string, value) {
    this.state[itemName].value = value;
    this.announceChange('State was changed: ' + itemName + ' to ' + this.state[itemName].value);
  }

  getState() {
    return this.state;
  }

  announceChange(message: string) {
    this.messageService.announceMessage(message);
  }

  windowResize() {
    const playerDiv = document.getElementById('playerDiv') as HTMLElement;
    if (playerDiv == null) {
      return;
    }

    this.updateState('windowHeight', window.outerHeight);
    this.updateState('playerHeight', playerDiv.clientHeight);
    this.updateState('pixelRatio', window.devicePixelRatio);
    this.updateState('playerTopHTML', playerDiv.offsetTop);
    this.updateState('playerTopCanvas', playerDiv.offsetTop * window.devicePixelRatio);
  }

  public getSelectedCubeSPSCount() {
    let count = 0;
    for (let index = 0; index < this.CubeSPSs.length; index++) {
      count += (this.newBaseOptions.visual[0].types[index].value ? 1 : 0);
    }
    return count;
  }

  get renderPlayer(): boolean {
    return this.state.renderPlayer.value;
  }

  set renderPlayer(value: boolean) {
    this.state.renderPlayer.value = value;
  }

  get showTrackTitle(): boolean {
    return this.state.showTrackTitle.value;
  }

  set showTrackTitle(value: boolean) {
    this.state.showTrackTitle.value = value;
  }

  get volume(): number {
    return this.state.volume.value;
  }

  set volume(value: number) {
    this.state.volume.value = value as number;
  }

  get showPanel(): boolean {
    return this.state.showPanel.value;
  }

  get showFavorites(): boolean {
    return this.state.showFavorites.value;
  }

  get showPlayer(): boolean {
    return this.state.showPlayer.value;
  }

  get showSplash(): boolean {
    return this.state.showSplash.value;
  }

  get currentVisual(): number {
    return this.state.currentVisual.value;
  }

  set currentVisual(value: number) {
    this.state.currentVisual.value = value;
  }

  get currentTrack(): number {
    return this.state.currentTrack.value;
  }

  get input(): string {
    return this.state.input.value;
  }

  set input(value: string) {
    this.state.input.value = value;
  }

  get playing(): boolean {
    return this.state.playing.value;
  }

  set playing(value: boolean) {
    this.state.playing.value = value;
  }

  get microphone(): boolean {
    return this.state.microphone.value;
  }

  set microphone(value: boolean) {
    this.state.microphone.value = value;
  }

}
