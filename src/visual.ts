/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
module powerbi.extensibility.visual {

    export interface ScriptResult {
        source: string;
        provider: string;
    }

    interface VisualSettings1 {
        show: boolean;
        mytype: string;
        method: string;
        addrect: string;
        order: string;
    }

    interface VisualSettings3 {
        show: boolean;
        textSize: number;
        tl_col: string;
    }
    interface VisualSettings4 {
        show: boolean;
        addCoef_col: string;
        number_digits: string;
        textSize: number;

    }
    interface VisualSettings5 {
        show: boolean;
        showWarnings: boolean;
    }

    export class Visual implements IVisual {
        private imageDiv: HTMLDivElement;
        private imageElement: HTMLImageElement;

        private settings1: VisualSettings1;
        private settings3: VisualSettings3;
        private settings4: VisualSettings4;
        private settings5: VisualSettings5;


        public constructor(options: VisualConstructorOptions) {
            this.imageDiv = document.createElement('div');
            this.imageDiv.className = 'rcv_autoScaleImageContainer';
            options.element.appendChild(this.imageDiv);

            this.imageElement = document.createElement('img');
            this.imageElement.className = 'rcv_autoScaleImage';

            this.imageDiv.appendChild(this.imageElement);

            this.settings1 = <VisualSettings1>{
                show: false,
                method: "circle",
                mytype: "full",
                order: "original",
                addrect: "None",
            };

            this.settings3 = <VisualSettings3>{
                show: false,
                textSize: 10,
                tl_col: "red",
            };
            this.settings4 = <VisualSettings4>{
                show: false,
                addCoef_col: "black",
                number_digits: "1",
                textSize: 8
            };
            this.settings5 = <VisualSettings5>{
                show: false,
                showWarnings: false,
            };
        }

        public update(options: VisualUpdateOptions) {
            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView: DataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            this.settings1 = <VisualSettings1>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings1', 'show', false),
                method: getValue<string>(dataView.metadata.objects, 'settings1', 'method', "circle"),
                mytype: getValue<string>(dataView.metadata.objects, 'settings1', 'mytype', "full"),
                addrect: getValue<string>(dataView.metadata.objects, 'settings1', 'addrect', "0"),
                order: getValue<string>(dataView.metadata.objects, 'settings1', 'order', "original"),


            };


            this.settings3 = <VisualSettings3>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings3', 'show', false),
                textSize: getValueMinMax<number>(dataView.metadata.objects, 'settings3', 'textSize', 10, 5, 50),
                tl_col: getValue<string>(dataView.metadata.objects, 'settings3', 'tl_col', "red"),
            };
            this.settings4 = <VisualSettings4>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings4', 'show', false),
                addCoef_col: getValue<string>(dataView.metadata.objects, 'settings4', 'addCoef_col', "black"),
                number_digits: getValue<string>(dataView.metadata.objects, 'settings4', 'number_digits', "1"),
                textSize: getValue<number>(dataView.metadata.objects, 'settings4', 'textSize', 8)

            };
            this.settings5 = <VisualSettings5>{
                show: getValue<boolean>(dataView.metadata.objects, 'settings5', 'show', false),
                showWarnings: getValue<boolean>(dataView.metadata.objects, 'settings5', 'showWarnings', false)
            };

            let imageUrl: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
            }

            if (imageUrl) {
                this.imageElement.src = imageUrl;
            } else {
                this.imageElement.src = null;
            }

            this.onResizing(options.viewport);
        }

        public onResizing(finalViewport: IViewport): void {
            this.imageDiv.style.height = finalViewport.height + 'px';
            this.imageDiv.style.width = finalViewport.width + 'px';
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                case 'settings1':
                    if (this.settings1.addrect == "0") {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                show: this.settings1.show,
                                method: this.settings1.method,
                                addrect: this.settings1.addrect,
                                mytype: this.settings1.mytype,
                                order: this.settings1.order
                            },
                            selector: null
                        });
                    }
                    else {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                show: this.settings1.show,
                                method: this.settings1.method,
                                addrect: this.settings1.addrect,
                            },
                            selector: null
                        });

                    }
                    break;

                case 'settings3':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings3.show,
                            textSize: this.settings3.textSize,
                            tl_col: this.settings3.tl_col
                        },
                        selector: null
                    });
                    break;
                case 'settings4':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings4.show,
                            number_digits: this.settings4.number_digits,
                            addCoef_col: this.settings4.addCoef_col,
                            textSize: this.settings4.textSize,
                        },
                        selector: null
                    });
                    break;
                case 'settings5':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: this.settings5.show,
                            showWarnings: this.settings5.showWarnings,
                        },
                        selector: null
                    });
                    break;
            };

            return objectEnumeration;
        }
    }
}