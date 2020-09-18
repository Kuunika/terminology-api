export interface ConceptMap {
    resourceType: string;
    id:           string;
    text:         Text;
    url:          string;
    identifier:   Identifier;
    version:      string;
    name:         string;
    title:        string;
    status:       string;
    experimental: boolean;
    date:         string;
    publisher:    string;
    contact:      Contact[];
    description:  string;
    useContext:   UseContext[];
    jurisdiction: Jurisdiction[];
    purpose:      string;
    copyright:    string;
    sourceUri:    string;
    targetUri:    string;
    group:        Group[];
}

export interface Contact {
    name:    string;
    telecom: Identifier[];
}

export interface Identifier {
    system: string;
    value:  string;
}

export interface Group {
    source:   string;
    target:   string;
    element:  Element[];
    unmapped: Unmapped;
}

export interface Element {
    code:    string;
    display: string;
    target:  Target[];
}

export interface Target {
    code:        string;
    display:     string;
    equivalence: string;
    comment?:    string;
}

export interface Unmapped {
    mode:    string;
    code:    string;
    display: string;
}

export interface Jurisdiction {
    coding: Cod[];
}

export interface Cod {
    system: string;
    code:   string;
}

export interface Text {
    status: string;
    div:    string;
}

export interface UseContext {
    code:                 Cod;
    valueCodeableConcept: ValueCodeableConcept;
}

export interface ValueCodeableConcept {
    text: string;
}
