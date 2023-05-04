AFRAME.registerComponent('gltf-manipulator', {
    schema: {
        // Node Material Manipulation
        nodeNumber: { type: 'int', default: 1 },
        nodeName: { type: 'array', default: [] },
        nodePosition: { type: 'array', default: [] },
        nodeRotation: { type: 'array', default: [] },
        nodeScale: { type: 'array', default: [] },
        nodeVisibility: { type: 'array', default: [] },
        nodeMaterialName: { type: 'array', default: [] },
        nodeTextureURL: { type: 'array', default: [] },
        nodeColor: { type: 'array', default: [] },
    },
    init: function () {
        let el = this.el;
        // Texture related variables
        let my_nodeNumber = this.data.nodeNumber;
        let my_nodeMaterialName = this.data.nodeMaterialName;
        let my_nodeTextureURL = this.data.nodeTextureURL;
        let my_nodeColor = this.data.nodeColor;

        // Position/rotation/scale/visibility related variables
        let my_nodeName = this.data.nodeName;
        let my_nodePosition = this.data.nodePosition;
        let my_nodeRotation = this.data.nodeRotation;
        let my_nodeScale = this.data.nodeScale;
        let my_nodeVisibility = this.data.nodeVisibility;

        // Create button
        let myButton = document.createElement('button');
        myButton.id = "myButton";
         myButton.innerHTML = 'Update GLTF';
         myButton.style.position = 'fixed';
         myButton.style.bottom = '50px';
         myButton.style.left = '50%';
         myButton.style.transform = 'translateX(-50%)';
         myButton.style.zIndex = '3';
         // Append button to scene
         document.body.appendChild(myButton);

        // As soon as 3D model is loaded
        el.addEventListener("model-loaded", function (event) {

            // Change texture/color of the model
            event.detail.model.traverse(function (node) {
                if (node.isMesh) {
                    // Log gltf names of nodes.
                    console.log(`nodeName: ${node.name}, nodeMaterialName: ${node.material.name}`)

                    // Set position/rotation/scale/visibility
                    for (let i = 0; i < my_nodeNumber; i++) {
                        if (node.name === my_nodeName[i]) {
                            // Set position
                            if (my_nodePosition[i] != null) {
                                let pos = my_nodePosition[i].split(" ");
                                let posX = pos[0];
                                let posY = pos[1];
                                let posZ = pos[2];
                                node.position.set(posX, posY, posZ);
                            }
                            // Set rotation
                            if (my_nodeRotation[i] != null) {
                                let rot = my_nodeRotation[i].split(" ");
                                let rotX = rot[0];
                                let rotY = rot[1];
                                let rotZ = rot[2];
                                node.rotation.set(rotX, rotY, rotZ);
                            }
                            // Set scale
                            if (my_nodeScale[i] != null) {
                                let scl = my_nodeScale[i].split(" ");
                                let sclX = scl[0];
                                let sclY = scl[1];
                                let sclZ = scl[2];
                                node.scale.set(sclX, sclY, sclZ);
                            }

                            // Set visibility
                            if (my_nodeVisibility[i] == "true") {
                                node.visible = true;
                            } else if (my_nodeVisibility[i] == "false") {
                                node.visible = false;
                            }
                        }
                        // Set material texture/color
                        if (node.material && node.material.name === my_nodeMaterialName[i]) {
                            // Load textures     
                            if (my_nodeTextureURL[i] != null) {
                                let newTxt = new THREE.TextureLoader().load(my_nodeTextureURL[i]);
                                newTxt.flipY = false;
                                // Add new texture
                                node.material.map = newTxt;
                            } else {
                                // Change color
                                node.material.color.set(my_nodeColor[i]);
                            }
                        }
                    }
                };
            });
        });

        this.el.addEventListener('update-node', (event) => {
            const { nodeName, position, rotation, scale, visibility, nodeTextureURL, color } = event.detail;
            this.updateNode(nodeName, position, rotation, scale, visibility, nodeTextureURL, color);
        });
    },
    updateNode(nodeName, position, rotation, scale, visibility, nodeTextureURL, color) {
        this.el.object3D.traverse((node) => {
            if (node.isMesh) {
                if (node.name === nodeName || node.material.name === nodeName) {

                    if (position) {
                        node.position.set(...position.split(' ').map(parseFloat));
                    }
                    if (rotation) {
                        node.rotation.set(...rotation.split(' ').map(parseFloat));
                    }
                    if (scale) {
                        node.scale.set(...scale.split(' ').map(parseFloat));
                    }
                    if (visibility !== undefined) {
                        node.visible = visibility;
                    }
                    if (nodeTextureURL) {
                        let newTxt = new THREE.TextureLoader().load(nodeTextureURL);
                        newTxt.flipY = false;
                        // Add new texture
                        node.material.map = newTxt;
                    }
                    if (color) {
                        node.material.color.set(color);
                    }
                }
            }
        });
    },
});

function updateNodeFunction(nodeName, textureURL, pos, rot, scl, col, vis) {
    const modelEl = document.querySelector('a-entity[gltf-manipulator]');
    modelEl.emit('update-node', {
        nodeName: nodeName,
        position: pos,
        rotation: rot,
        scale: scl,
        color: col,
        nodeTextureURL: textureURL,
        visibility: vis
    });
}